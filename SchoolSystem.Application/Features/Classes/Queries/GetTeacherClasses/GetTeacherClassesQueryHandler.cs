using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Classes.DTOs.Read;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Classes.Queries.GetTeacherClasses
{
    public class GetTeacherClassesQueryHandler : IRequestHandler<GetTeacherClassesQuery, List<ClassResponseDto>>
    {
        private readonly IGenericRepository<Class> _classRepo;
        private readonly IGenericRepository<Teacher> _teacherRepo;
        private readonly IGenericRepository<Lesson> _lessonRepo;
        private readonly IGenericRepository<Homework> _homeworkRepo;
        private readonly IGenericRepository<HomeworkSubmission> _homeworkSubmissionRepo;
        private readonly IGenericRepository<Exam> _examRepo;
        private readonly IGenericRepository<ExamResult> _examResultRepo;
        private readonly IGenericRepository<Domain.Entities.Attendance> _attendanceRepo;

        public GetTeacherClassesQueryHandler(
            IGenericRepository<Class> classRepo,
            IGenericRepository<Teacher> teacherRepo,
            IGenericRepository<Lesson> lessonRepo,
            IGenericRepository<Homework> homeworkRepo,
            IGenericRepository<HomeworkSubmission> homeworkSubmissionRepo,
            IGenericRepository<Exam> examRepo,
            IGenericRepository<ExamResult> examResultRepo,
            IGenericRepository<Domain.Entities.Attendance> attendanceRepo)
        {
            _classRepo = classRepo;
            _teacherRepo = teacherRepo;
            _lessonRepo = lessonRepo;
            _homeworkRepo = homeworkRepo;
            _homeworkSubmissionRepo = homeworkSubmissionRepo;
            _examRepo = examRepo;
            _examResultRepo = examResultRepo;
            _attendanceRepo = attendanceRepo;
        }

        public async Task<List<ClassResponseDto>> Handle(GetTeacherClassesQuery request, CancellationToken cancellationToken)
        {
            var teacher = await _teacherRepo
                .GetAllQueryable()
                .FirstOrDefaultAsync(t => t.UserId == request.TeacherId, cancellationToken);

            if (teacher == null)
                return new List<ClassResponseDto>();

            var classes = await _classRepo
                .GetAllQueryable()
                .Include(c => c.Students)
                .Include(c => c.Sections)
                .Where(c => c.ClassTeachers.Any(ct => ct.TeacherOid == teacher.Oid && !ct.IsDeleted) && !c.IsDeleted)
                .ToListAsync(cancellationToken);

            var result = new List<ClassResponseDto>();

            foreach (var classEntity in classes)
            {
                var classDto = new ClassResponseDto
                {
                    Oid = classEntity.Oid,
                    Name = classEntity.Name,
                    Level = classEntity.Level,
                    CreatedAt = classEntity.CreatedAt,
                    StudentsCount = classEntity.Students?.Count(s => !s.IsDeleted) ?? 0,
                    SectionsCount = classEntity.Sections?.Count(s => !s.IsDeleted) ?? 0,
                    Students = new List<StudentBasicInfoDto>()
                };

                // ⭐ OPTIMIZATION: Get all lessons/homeworks/exams for this class ONCE outside the student loop
                var classLessons = await _lessonRepo
                    .GetAllQueryable()
                    .Where(l => l.ClassOid == classEntity.Oid && !l.IsDeleted && l.TeacherOid == teacher.Oid) // ⭐ FIXED: Added TeacherOid filter
                    .ToListAsync(cancellationToken);

                var classHomeworks = await _homeworkRepo
                    .GetAllQueryable()
                    .Where(h => h.ClassOid == classEntity.Oid && !h.IsDeleted && h.TeacherOid == teacher.Oid) // ⭐ FIXED: Added TeacherOid filter
                    .ToListAsync(cancellationToken);

                var classExams = await _examRepo
                    .GetAllQueryable()
                    .Where(e => e.ClassOid == classEntity.Oid && !e.IsDeleted && e.TeacherOid == teacher.Oid) // ⭐ FIXED: Added TeacherOid filter
                    .ToListAsync(cancellationToken);

                var examIds = classExams.Select(e => e.Oid).ToList();

                foreach (var student in (classEntity.Students ?? new List<Student>()).Where(s => !s.IsDeleted))
                {
                    var studentDto = new StudentBasicInfoDto
                    {
                        Oid = student.Oid,
                        FullName = student.FullName,
                        Email = student.Email,
                        Phone = student.Phone,
                        Details = new StudentDetailsDto()
                    };

                    // Lessons - Now filtered by TeacherOid
                    var lessons = classLessons
                        .Select(l => new LessonInfoDto
                        {
                            Oid = l.Oid,
                            Title = l.Title,
                            Date = l.Date,
                            Status = l.Status.ToString()
                        })
                        .ToList();
                    studentDto.Details.Lessons = lessons;

                    // Homeworks - Now filtered by TeacherOid
                    var homeworks = classHomeworks
                        .Select(h => new HomeworkInfoDto
                        {
                            Oid = h.Oid,
                            Title = h.Title,
                            DueDate = h.DueDate,
                            Status = h.Status.ToString(),
                            Grade = _homeworkSubmissionRepo.GetAllQueryable()
                                .FirstOrDefault(s => s.HomeworkOid == h.Oid && s.StudentOid == student.Oid)?.Grade
                        })
                        .ToList();
                    studentDto.Details.Homeworks = homeworks;

                    // Exams - Now filtered by TeacherOid
                    var examResults = await _examResultRepo
                        .GetAllQueryable()
                        .Cast<ExamResult>()
                        .Where(r => r.ExamOid.HasValue && examIds.Contains(r.ExamOid.Value) && r.StudentOid == student.Oid)
                        .ToListAsync(cancellationToken);

                    var examDtos = classExams.Select(e => new ExamInfoDto
                    {
                        Oid = e.Oid,
                        Name = e.Name,
                        Date = e.Date,
                        Score = examResults.FirstOrDefault(r => r.ExamOid == e.Oid)?.Score,
                        Grade = examResults.FirstOrDefault(r => r.ExamOid == e.Oid)?.Grade ?? string.Empty
                    }).ToList();
                    studentDto.Details.Exams = examDtos;

                    // Attendance - Intentionally left UNFILTERED by TeacherOid (homeroom/class-wide)
                    var attendances = await _attendanceRepo
                        .GetAllQueryable()
                        .Where(a => a.StudentOid == student.Oid && a.ClassOid == classEntity.Oid && !a.IsDeleted)
                        .ToListAsync(cancellationToken);

                    var presentCount = attendances.Count(a => a.Status == AttendanceStatus.Present);
                    var absentCount = attendances.Count(a => a.Status == AttendanceStatus.Absent);
                    var lateCount = attendances.Count(a => a.Status == AttendanceStatus.Late);
                    var totalDays = attendances.Count;

                    studentDto.Details.Attendance = new AttendanceInfoDto
                    {
                        PresentCount = presentCount,
                        AbsentCount = absentCount,
                        LateCount = lateCount,
                        AttendancePercentage = totalDays > 0 ? (double)presentCount / totalDays * 100 : 0,
                        RecentRecords = attendances
                            .OrderByDescending(a => a.Date)
                            .Take(5)
                            .Select(a => new AttendanceRecordDto
                            {
                                Date = a.Date,
                                Status = a.Status.ToString(),
                                Remarks = a.Remarks ?? ""
                            })
                            .ToList()
                    };

                    classDto.Students.Add(studentDto);
                }

                result.Add(classDto);
            }

            return result;
        }
    }
}