// Application/Features/Parents/Queries/GetMyChildren/GetMyChildrenQueryHandler.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Parents.DTOs;
using SchoolSystem.Application.Features.StudentGrades.Queries.GetStudentGrades;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Parents.Queries.GetMyChildren
{
    public class GetMyChildrenQueryHandler : IRequestHandler<GetMyChildrenQuery, MyChildrenDto>
    {
        private readonly IGenericRepository<Parent> _parentRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<Class> _classRepo;
        private readonly IGenericRepository<Domain.Entities.Attendance> _attendanceRepo;
        private readonly IGenericRepository<ExamResult> _examResultRepo;
        private readonly IGenericRepository<HomeworkSubmission> _submissionRepo;
        private readonly IMediator _mediator;

        public GetMyChildrenQueryHandler(
            IGenericRepository<Parent> parentRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<Class> classRepo,
            IGenericRepository<Domain.Entities.Attendance> attendanceRepo,
            IGenericRepository<ExamResult> examResultRepo,
            IGenericRepository<HomeworkSubmission> submissionRepo,
            IMediator mediator)
        {
            _parentRepo = parentRepo;
            _studentRepo = studentRepo;
            _classRepo = classRepo;
            _attendanceRepo = attendanceRepo;
            _examResultRepo = examResultRepo;
            _submissionRepo = submissionRepo;
            _mediator = mediator;
        }

        public async Task<MyChildrenDto> Handle(GetMyChildrenQuery request, CancellationToken cancellationToken)
        {
            var parent = await _parentRepo.GetAllQueryable()
                .FirstOrDefaultAsync(p => p.UserId == request.ParentUserId, cancellationToken);

            if (parent == null)
                throw new Exception("Parent not found");

            var students = await _studentRepo.GetAllQueryable()
                .Include(s => s.Class)
                .Where(s => s.ParentOid == parent.Oid)
                .ToListAsync(cancellationToken);

            var childrenList = new List<ChildDetailsDto>();

            foreach (var student in students)
            {
                var gradesQuery = new GetStudentGradesQuery(student.Oid);
                var gradesData = await _mediator.Send(gradesQuery, cancellationToken);

                double gpa = gradesData?.OverallGPA?.GPA ?? 0;

                var subjectsCount = await GetSubjectsCount(student.Oid, cancellationToken);

                var attendancePercentage = await CalculateAttendancePercentage(student.Oid, cancellationToken);

                var gradeLevel = FormatGradeLevel(student.Class?.Name);

                childrenList.Add(new ChildDetailsDto
                {
                    ChildId = student.Oid,
                    Name = student.FullName ?? "Unknown",
                    GradeLevel = gradeLevel,
                    GPA = Math.Round(gpa, 1),
                    Attendance = Math.Round(attendancePercentage, 0),
                    SubjectsCount = subjectsCount
                });
            }

            return new MyChildrenDto
            {
                Children = childrenList
            };
        }

        private async Task<int> GetSubjectsCount(
            Guid studentOid,
            CancellationToken cancellationToken)
        {
            var examSubjects = await _examResultRepo.GetAllQueryable()
                .Include(er => er.Exam)
                .Where(er => er.StudentOid == studentOid)
                .Select(er => er.Exam.SubjectOid)
                .Distinct()
                .ToListAsync(cancellationToken);

            var homeworkSubjects = await _submissionRepo.GetAllQueryable()
                .Include(s => s.Homework)
                .Where(s => s.StudentOid == studentOid && !s.IsDeleted)
                .Select(s => s.Homework.SubjectOid)
                .Distinct()
                .ToListAsync(cancellationToken);

            return examSubjects.Union(homeworkSubjects).Distinct().Count();
        }

        private async Task<double> CalculateAttendancePercentage(Guid studentOid, CancellationToken cancellationToken)
        {
            var attendances = await _attendanceRepo.GetAllQueryable()
                .Where(a => a.StudentOid == studentOid)
                .ToListAsync(cancellationToken);

            if (!attendances.Any())
                return 0;

            var dailyAttendance = attendances
                .GroupBy(a => a.Date.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    Status = g.Any(a => a.Status == AttendanceStatus.Absent)
                        ? AttendanceStatus.Absent
                        : g.Any(a => a.Status == AttendanceStatus.Late)
                            ? AttendanceStatus.Late
                            : AttendanceStatus.Present
                })
                .ToList();

            var presentDays = dailyAttendance.Count(d => d.Status == AttendanceStatus.Present);
            return dailyAttendance.Any() ? (double)presentDays / dailyAttendance.Count * 100 : 0;
        }

        private string FormatGradeLevel(string className)
        {
            if (string.IsNullOrEmpty(className)) return "N/A";

            if (System.Text.RegularExpressions.Regex.IsMatch(className, @"^\d+(st|nd|rd|th)$"))
                return className;

            var match = System.Text.RegularExpressions.Regex.Match(className, @"(\d+)");
            if (match.Success && int.TryParse(match.Groups[1].Value, out int grade))
            {
                return $"{grade}{GetOrdinal(grade)}";
            }

            return className;
        }

        private string GetOrdinal(int number)
        {
            return (number % 100) switch
            {
                11 or 12 or 13 => "th",
                _ => (number % 10) switch
                {
                    1 => "st",
                    2 => "nd",
                    3 => "rd",
                    _ => "th"
                }
            };
        }
    }
}