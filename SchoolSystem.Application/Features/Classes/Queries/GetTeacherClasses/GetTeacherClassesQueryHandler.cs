using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Classes.DTOs.Read;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Classes.Queries.GetTeacherClasses
{
    public class GetTeacherClassesQueryHandler : IRequestHandler<GetTeacherClassesQuery, List<TeacherClassFormatDto>>
    {
        private readonly IGenericRepository<Class> _classRepo;
        private readonly IGenericRepository<Teacher> _teacherRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<Lesson> _lessonRepo;
        private readonly IGenericRepository<Homework> _homeworkRepo;
        private readonly IGenericRepository<HomeworkSubmission> _homeworkSubmissionRepo;
        private readonly IGenericRepository<Exam> _examRepo;
        private readonly IGenericRepository<ExamResult> _examResultRepo;
        private readonly IGenericRepository<Domain.Entities.Attendance> _attendanceRepo;

        public GetTeacherClassesQueryHandler(
            IGenericRepository<Class> classRepo,
            IGenericRepository<Teacher> teacherRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<Lesson> lessonRepo,
            IGenericRepository<Homework> homeworkRepo,
            IGenericRepository<HomeworkSubmission> homeworkSubmissionRepo,
            IGenericRepository<Exam> examRepo,
            IGenericRepository<ExamResult> examResultRepo,
            IGenericRepository<Domain.Entities.Attendance> attendanceRepo)
        {
            _classRepo = classRepo;
            _teacherRepo = teacherRepo;
            _studentRepo = studentRepo;
            _lessonRepo = lessonRepo;
            _homeworkRepo = homeworkRepo;
            _homeworkSubmissionRepo = homeworkSubmissionRepo;
            _examRepo = examRepo;
            _examResultRepo = examResultRepo;
            _attendanceRepo = attendanceRepo;
        }

        public async Task<List<TeacherClassFormatDto>> Handle(GetTeacherClassesQuery request, CancellationToken cancellationToken)
        {
            var teacher = await _teacherRepo
                .GetAllQueryable()
                .FirstOrDefaultAsync(t => t.UserId == request.TeacherId, cancellationToken);

            if (teacher == null)
                return new List<TeacherClassFormatDto>();

            var classes = await _classRepo
                .GetAllQueryable()
                .Where(c => c.TeacherOid == teacher.Oid && !c.IsDeleted)
                .ToListAsync(cancellationToken);

            var result = new List<TeacherClassFormatDto>();

            foreach (var classEntity in classes)
            {
                // جلب الدروس في الصف
                var lessons = await _lessonRepo
                    .GetAllQueryable()
                    .Where(l => l.ClassOid == classEntity.Oid && !l.IsDeleted)
                    .OrderBy(l => l.Date)
                    .Select(l => new ClassLessonDto
                    {
                        Id = l.Oid.ToString(),
                        Title = l.Title ?? string.Empty,
                        Date = l.Date,
                        Status = l.Status.ToString()
                    })
                    .ToListAsync(cancellationToken);

                // جلب الامتحانات في الصف
                var exams = await _examRepo
                    .GetAllQueryable()
                    .Where(e => e.ClassOid == classEntity.Oid && !e.IsDeleted)
                    .OrderBy(e => e.Date)
                    .Select(e => new ClassExamDto
                    {
                        Id = e.Oid.ToString(),
                        Name = e.Name ?? string.Empty,
                        Date = e.Date,
                        Status = e.Status.ToString()
                    })
                    .ToListAsync(cancellationToken);

                // جلب الواجبات في الصف
                var homeworks = await _homeworkRepo
                    .GetAllQueryable()
                    .Where(h => h.ClassOid == classEntity.Oid && !h.IsDeleted)
                    .OrderBy(h => h.DueDate)
                    .Select(h => new ClassHomeworkDto
                    {
                        Id = h.Oid.ToString(),
                        Title = h.Title ?? string.Empty,
                        DueDate = h.DueDate,
                        Status = h.Status.ToString()
                    })
                    .ToListAsync(cancellationToken);

                // جلب الطلاب
                var students = await _studentRepo
                    .GetAllQueryable()
                    .Where(s => s.ClassOid == classEntity.Oid && !s.IsDeleted)
                    .ToListAsync(cancellationToken);

                var studentDtos = new List<ClassStudentDto>();

                foreach (var student in students)
                {
                    // حضور الطالب
                    var attendances = await _attendanceRepo
                        .GetAllQueryable()
                        .Where(a => a.StudentOid == student.Oid && a.ClassOid == classEntity.Oid && !a.IsDeleted)
                        .ToListAsync(cancellationToken);

                    var presentCount = attendances.Count(a => a.Status == AttendanceStatus.Present);
                    var absentCount = attendances.Count(a => a.Status == AttendanceStatus.Absent);
                    var lateCount = attendances.Count(a => a.Status == AttendanceStatus.Late);
                    var totalDays = attendances.Count;
                    var percentage = totalDays > 0 ? (double)presentCount / totalDays * 100 : 0;

                    // واجبات الطالب
                    var studentHomeworks = await _homeworkSubmissionRepo
                        .GetAllQueryable()
                        .Include(h => h.Homework)
                        .Where(h => h.StudentOid == student.Oid && h.Homework.ClassOid == classEntity.Oid && !h.IsDeleted)
                        .Select(h => new ClassStudentHomeworkDto
                        {
                            Id = h.Oid.ToString(),
                            Title = h.Homework.Title,
                            DueDate = h.Homework.DueDate,
                            Status = h.Status.ToString(),
                            Grade = h.Grade
                        })
                        .ToListAsync(cancellationToken);

                    // امتحانات الطالب
                    var studentExams = await _examResultRepo
                        .GetAllQueryable()
                        .Include(r => r.Exam)
                        .Where(r => r.StudentOid == student.Oid && r.Exam.ClassOid == classEntity.Oid && !r.IsDeleted)
                        .Select(r => new ClassStudentExamDto
                        {
                            Id = r.Oid.ToString(),
                            Name = r.Exam.Name,
                            Date = r.Exam.Date,
                            Score = r.Score,
                            Grade = r.Grade
                        })
                        .ToListAsync(cancellationToken);

                    // دروس الطالب
                    var studentLessons = await _lessonRepo
                        .GetAllQueryable()
                        .Where(l => l.ClassOid == classEntity.Oid && !l.IsDeleted)
                        .Select(l => new ClassStudentLessonDto
                        {
                            Id = l.Oid.ToString(),
                            Title = l.Title ?? string.Empty,
                            Date = l.Date,
                            Status = l.Status.ToString()
                        })
                        .ToListAsync(cancellationToken);

                    studentDtos.Add(new ClassStudentDto
                    {
                        Id = student.Oid.ToString(),
                        FullName = student.FullName,
                        Email = student.Email,
                       
                    });
                }

                result.Add(new TeacherClassFormatDto
                {
                    ClassId = classEntity.Oid.ToString(),
                    Name = classEntity.Name,
                    Level = classEntity.Level,
                    StudentsCount = students.Count,
                    Lessons = lessons,
                    Exams = exams,
                    Homeworks = homeworks,
                    Students = studentDtos
                });
            }

            return result;
        }
    }
}