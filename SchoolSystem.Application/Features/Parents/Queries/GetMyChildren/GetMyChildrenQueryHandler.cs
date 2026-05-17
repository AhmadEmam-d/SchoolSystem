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
        private readonly IGenericRepository<Lesson> _lessonRepo;   // ← replaced
        private readonly IMediator _mediator;

        public GetMyChildrenQueryHandler(
            IGenericRepository<Parent> parentRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<Class> classRepo,
            IGenericRepository<Domain.Entities.Attendance> attendanceRepo,
            IGenericRepository<Lesson> lessonRepo,                 // ← replaced
            IMediator mediator)
        {
            _parentRepo = parentRepo;
            _studentRepo = studentRepo;
            _classRepo = classRepo;
            _attendanceRepo = attendanceRepo;
            _lessonRepo = lessonRepo;
            _mediator = mediator;
        }

        public async Task<MyChildrenDto> Handle(GetMyChildrenQuery request, CancellationToken cancellationToken)
        {
            var parent = await _parentRepo.GetAllQueryable()
                .Cast<Parent>()
                .FirstOrDefaultAsync(p => p.UserId == request.ParentUserId, cancellationToken);

            if (parent == null)
                throw new Exception("Parent not found");

            var students = await _studentRepo.GetAllQueryable()
                .Cast<Student>()
                .Include(s => s.Class)
                .Where(s => s.ParentOid == parent.Oid)
                .ToListAsync(cancellationToken);

            var childrenList = new List<ChildDetailsDto>();

            foreach (var student in students)
            {
                var gradesData = await _mediator.Send(
                    new GetStudentGradesQuery(student.Oid), cancellationToken);

                double gpa = gradesData?.OverallGPA?.GPA ?? 0;

                // ← Fix: pass ClassOid
                var subjectsCount = await GetSubjectsCount(student.ClassOid, cancellationToken);

                var attendancePercentage = await CalculateAttendancePercentage(student.Oid, cancellationToken);

                var gradeLevel = FormatGradeLevel(student.Class?.Name ?? string.Empty);

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

            return new MyChildrenDto { Children = childrenList };
        }

        // ← Fix: count by ClassOid from Lesson table
        private async Task<int> GetSubjectsCount(
            Guid classOid, CancellationToken cancellationToken)
        {
            return await _lessonRepo.GetAllQueryable()
                .Cast<Lesson>()
                .Where(l => !l.IsDeleted && l.ClassOid == classOid)
                .Select(l => l.SubjectOid)
                .Distinct()
                .CountAsync(cancellationToken);
        }

        private async Task<double> CalculateAttendancePercentage(
            Guid studentOid, CancellationToken cancellationToken)
        {
            var attendances = await _attendanceRepo.GetAllQueryable()
                .Cast<Domain.Entities.Attendance>()
                .Where(a => a.StudentOid == studentOid)
                .ToListAsync(cancellationToken);

            if (!attendances.Any()) return 0;

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
                return $"{grade}{GetOrdinal(grade)}";
            return className;
        }

        private string GetOrdinal(int number) => (number % 100) switch
        {
            11 or 12 or 13 => "th",
            _ => (number % 10) switch { 1 => "st", 2 => "nd", 3 => "rd", _ => "th" }
        };
    }
}