using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Sections.DTOs.Read;
using SchoolSystem.Application.Features.Teachers.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Teachers.Query.GetById
{
    public class GetTeacherByIdQueryHandler
        : IRequestHandler<GetTeacherByIdQuery, TeacherResponseDto>
    {
        private readonly IGenericRepository<Teacher> _teacherRepo;
        private readonly IGenericRepository<Class> _classRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<Lesson> _lessonRepo;
        private readonly IGenericRepository<Homework> _homeworkRepo;
        private readonly IGenericRepository<Exam> _examRepo;
        private readonly IGenericRepository<Domain.Entities.Attendance> _attendanceRepo;
        private readonly IGenericRepository<ExamResult> _examResultRepo;
        private readonly IMapper _mapper;

        public GetTeacherByIdQueryHandler(
            IGenericRepository<Teacher> teacherRepo,
            IGenericRepository<Class> classRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<Lesson> lessonRepo,
            IGenericRepository<Homework> homeworkRepo,
            IGenericRepository<Exam> examRepo,
            IGenericRepository<Domain.Entities.Attendance> attendanceRepo,
            IGenericRepository<ExamResult> examResultRepo,
            IMapper mapper)
        {
            _teacherRepo = teacherRepo;
            _classRepo = classRepo;
            _studentRepo = studentRepo;
            _lessonRepo = lessonRepo;
            _homeworkRepo = homeworkRepo;
            _examRepo = examRepo;
            _attendanceRepo = attendanceRepo;
            _examResultRepo = examResultRepo;
            _mapper = mapper;
        }

        public async Task<TeacherResponseDto> Handle(GetTeacherByIdQuery request, CancellationToken cancellationToken)
        {
            var teacher = await _teacherRepo
                .GetAllQueryable()
                .Include(t => t.User)
                .Include(t => t.TeacherSubjects)
                    .ThenInclude(ts => ts.Subject)
                .FirstOrDefaultAsync(t => t.Oid == request.Oid && !t.IsDeleted, cancellationToken);

            if (teacher == null)
                return null;

            var teacherDto = _mapper.Map<TeacherResponseDto>(teacher);

            // جلب الفصول التي يدرسها المعلم
            var classes = await _classRepo
                .GetAllQueryable()
                .Include(c => c.Students)
                .Where(c => c.TeacherOid == teacher.Oid && !c.IsDeleted)
                .Select(c => new TeacherClassBasicDto
                {
                    Oid = c.Oid,
                    Name = c.Name ?? string.Empty,
                    Level = c.Level ?? string.Empty,
                    StudentsCount = c.Students != null ? c.Students.Count(s => !s.IsDeleted) : 0
                })
                .ToListAsync(cancellationToken);

            // جلب جميع الطلاب من الفصول التي يدرسها المعلم
            var classIds = classes.Select(c => c.Oid).ToList();
            var students = await _studentRepo
                .GetAllQueryable()
                .Where(s => classIds.Contains(s.ClassOid) && !s.IsDeleted)
                .ToListAsync(cancellationToken);

            // حساب إحصائيات الطلاب
            var studentDtos = new List<StudentBasicDto>();
            foreach (var student in students)
            {
                var studentAttendances = await _attendanceRepo
                    .GetAllQueryable()
                    .Where(a => a.StudentOid == student.Oid && !a.IsDeleted)
                    .ToListAsync(cancellationToken);

                var studentPresentCount = studentAttendances.Count(a => a.Status == AttendanceStatus.Present);
                var studentTotalDays = studentAttendances.Count;
                var studentAttendancePercentage = studentTotalDays > 0 ? (double)studentPresentCount / studentTotalDays * 100 : 0;

                var studentExamResults = await _examResultRepo
                    .GetAllQueryable()
                    .Where(r => r.StudentOid == student.Oid && !r.IsDeleted)
                    .ToListAsync(cancellationToken);

                var studentAverageGrade = studentExamResults.Any() ? studentExamResults.Average(r => r.Score) : 0;

                studentDtos.Add(new StudentBasicDto
                {
                    Oid = student.Oid,
                    FullName = student.FullName,
                    Email = student.Email,
                    Phone = student.Phone,
                    ClassName = classes.FirstOrDefault(c => c.Oid == student.ClassOid)?.Name ?? string.Empty,
                    AttendancePercentage = Math.Round(studentAttendancePercentage, 1),
                    AverageGrade = Math.Round(studentAverageGrade, 1)
                });
            }

            // جلب الدروس
            var lessons = await _lessonRepo
                .GetAllQueryable()
                .Include(l => l.Class)
                .Where(l => l.TeacherOid == teacher.Oid && !l.IsDeleted)
                .OrderByDescending(l => l.CreatedAt)
                .Take(5)
                .Select(l => new LessonBasicDto
                {
                    Oid = l.Oid,
                    Title = l.Title ?? string.Empty,
                    ClassName = l.Class != null ? (l.Class.Name ?? string.Empty) : string.Empty,
                    Date = l.Date,
                    Status = l.Status.ToString()
                })
                .ToListAsync(cancellationToken);

            // جلب الواجبات
            var homeworks = await _homeworkRepo
                .GetAllQueryable()
                .Include(h => h.Class)
                .Where(h => h.TeacherOid == teacher.Oid && !h.IsDeleted)
                .OrderByDescending(h => h.CreatedAt)
                .Take(5)
                .Select(h => new HomeworkBasicDto
                {
                    Oid = h.Oid,
                    Title = h.Title ?? string.Empty,
                    ClassName = h.Class != null ? (h.Class.Name ?? string.Empty) : string.Empty,
                    DueDate = h.DueDate,
                    SubmissionsCount = h.Submissions != null ? h.Submissions.Count : 0,
                    Status = h.Status.ToString()
                })
                .ToListAsync(cancellationToken);

            // جلب الامتحانات
            var exams = await _examRepo
                .GetAllQueryable()
                .Include(e => e.Class)
                .Where(e => e.TeacherOid == teacher.Oid && !e.IsDeleted)
                .OrderByDescending(e => e.CreatedAt)
                .Take(5)
                .Select(e => new ExamBasicDto
                {
                    Oid = e.Oid,
                    Name = e.Name ?? string.Empty,
                    ClassName = e.Class != null ? (e.Class.Name ?? string.Empty) : string.Empty,
                    Date = e.Date,
                    AverageGrade = e.Results != null && e.Results.Any(r => r.Score > 0)
                        ? e.Results.Where(r => r.Score > 0).Average(r => (double)r.Score) : 0,
                    Status = e.Status.ToString()
                })
                .ToListAsync(cancellationToken);

            // حساب حضور المعلم
            var teacherAttendances = await _attendanceRepo
                .GetAllQueryable()
                .Include(a => a.Class)
                .Where(a => a.Class != null && a.Class.TeacherOid == teacher.Oid && !a.IsDeleted)
                .ToListAsync(cancellationToken);

            var teacherPresentCount = teacherAttendances.Count(a => a.Status == AttendanceStatus.Present);
            var teacherTotalDays = teacherAttendances.Count;
            var teacherAttendancePercentage = teacherTotalDays > 0 ? (double)teacherPresentCount / teacherTotalDays * 100 : 0;

            teacherDto.AcademicSummary = new TeacherAcademicSummaryDto
            {
                ClassesCount = classes.Count,
                LessonsCount = lessons.Count,
                HomeworksCount = homeworks.Count,
                ExamsCount = exams.Count,
                AttendancePercentage = Math.Round(teacherAttendancePercentage, 1),
                RecentClasses = classes.Take(3).ToList(),
                RecentLessons = lessons,
                RecentHomeworks = homeworks,
                RecentExams = exams
            };

            teacherDto.Students = studentDtos;

            return teacherDto;
        }
    }
}