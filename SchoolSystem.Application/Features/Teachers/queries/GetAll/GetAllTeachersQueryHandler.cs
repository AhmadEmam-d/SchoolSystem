using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Sections.DTOs.Read;
using SchoolSystem.Application.Features.Teachers.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Teachers.Query.GetAll
{
    public class GetAllTeachersQueryHandler
        : IRequestHandler<GetAllTeachersQuery, List<TeacherResponseDto>>
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

        public GetAllTeachersQueryHandler(
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

        public async Task<List<TeacherResponseDto>> Handle(GetAllTeachersQuery request, CancellationToken cancellationToken)
        {
            var teachers = await _teacherRepo
                .GetAllQueryable()
                .Include(t => t.User)
                .Include(t => t.TeacherSubjects)
                    .ThenInclude(ts => ts.Subject)
                .ToListAsync(cancellationToken);

            var result = new List<TeacherResponseDto>();

            foreach (var teacher in teachers)
            {
                var teacherDto = _mapper.Map<TeacherResponseDto>(teacher);

                var classes = await _classRepo
                    .GetAllQueryable()
                    .Where(c => c.ClassTeachers.Any(ct => ct.TeacherOid == teacher.Oid && !ct.IsDeleted) && !c.IsDeleted)
                    .ProjectTo<TeacherClassBasicDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                var classIds = classes.Select(c => c.Oid).ToList();
                var students = await _studentRepo
                    .GetAllQueryable()
                    .Where(s => classIds.Contains(s.ClassOid) && !s.IsDeleted)
                    .ToListAsync(cancellationToken);

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

                    var studentDto = _mapper.Map<StudentBasicDto>(student);
                    studentDto.ClassName = classes.FirstOrDefault(c => c.Oid == student.ClassOid)?.Name ?? string.Empty;
                    studentDto.AttendancePercentage = Math.Round(studentAttendancePercentage, 1);
                    studentDto.AverageGrade = Math.Round(studentAverageGrade, 1);

                    studentDtos.Add(studentDto);
                }

                var lessons = await _lessonRepo
                    .GetAllQueryable()
                    .Include(l => l.Class)
                    .Where(l => l.TeacherOid == teacher.Oid && !l.IsDeleted)
                    .OrderByDescending(l => l.CreatedAt)
                    .Take(5)
                    .ProjectTo<LessonBasicDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                var homeworks = await _homeworkRepo
                    .GetAllQueryable()
                    .Include(h => h.Class)
                    .Where(h => h.TeacherOid == teacher.Oid && !h.IsDeleted)
                    .OrderByDescending(h => h.CreatedAt)
                    .Take(5)
                    .ProjectTo<HomeworkBasicDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                var exams = await _examRepo
                    .GetAllQueryable()
                    .Include(e => e.Class)
                    .Where(e => e.TeacherOid == teacher.Oid && !e.IsDeleted)
                    .OrderByDescending(e => e.CreatedAt)
                    .Take(5)
                    .ProjectTo<ExamBasicDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                var teacherAttendances = await _attendanceRepo
                     .GetAllQueryable()
                     .Include(a => a.Class)
                         .ThenInclude(c => c.ClassTeachers)
                     .Where(a => a.Class != null
                         && a.Class.ClassTeachers.Any(ct => ct.TeacherOid == teacher.Oid && !ct.IsDeleted)
                         && !a.IsDeleted)
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
                result.Add(teacherDto);
            }

            return result;
        }
    }
}