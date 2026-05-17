// Application/Features/Parents/Queries/GetParentAttendance/GetParentAttendanceQueryHandler.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Parents.DTOs;
using SchoolSystem.Application.Features.StudentGrades.Queries.GetStudentGrades;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Parents.Queries.GetParentAttendance
{
    public class GetParentAttendanceQueryHandler
        : IRequestHandler<GetParentAttendanceQuery, ParentFullDashboardDto>
    {
        private readonly IGenericRepository<Domain.Entities.Attendance> _attendanceRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<User> _userRepo;
        private readonly IGenericRepository<Parent> _parentRepo;
        private readonly IMediator _mediator;

        public GetParentAttendanceQueryHandler(
            IGenericRepository<Domain.Entities.Attendance> attendanceRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<User> userRepo,
                IGenericRepository<Parent> parentRepo,
            IMediator mediator)
        {
            _attendanceRepo = attendanceRepo;
            _studentRepo = studentRepo;
            _userRepo = userRepo;
            _parentRepo = parentRepo;
            _mediator = mediator;
        }

        public async Task<ParentFullDashboardDto> Handle(
            GetParentAttendanceQuery request,
            CancellationToken cancellationToken)
        {
            var parentUser = await _userRepo.GetByOidAsync(request.ParentOid);
            var parentEntity = await _parentRepo.GetAllQueryable()
                    .Cast<Parent>()
                    .FirstOrDefaultAsync(p => p.UserId == request.ParentOid, cancellationToken);

            if (parentEntity == null)
                return new ParentFullDashboardDto { ParentName = parentUser?.FullName ?? "N/A", Children = new List<StudentDashboardDetailDto>() };
            var students = await _studentRepo.GetAllQueryable()
                .Cast<Student>()
                .Include(s => s.Class)
                .Include(s => s.Parent)
                .Where(s => s.ParentOid == parentEntity.Oid)
                .ToListAsync(cancellationToken);

            var studentIds = students.Select(s => s.Oid).ToList();

            var allRecords = await _attendanceRepo.GetAllQueryable()
                .Where(a => studentIds.Contains(a.StudentOid))
                .OrderByDescending(a => a.Date)
                .ToListAsync(cancellationToken);

            var response = new ParentFullDashboardDto
            {
                ParentName = parentUser?.FullName ?? "N/A",
                Children = new List<StudentDashboardDetailDto>()
            };

            foreach (var student in students)
            {
                var records = allRecords
                    .Where(a => a.StudentOid == student.Oid)
                    .ToList();

                var dailyRecords = records
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
                    .OrderByDescending(x => x.Date)
                    .ToList();

                int totalDays = dailyRecords.Count;
                int presentDays = dailyRecords.Count(d => d.Status == AttendanceStatus.Present);
                int absentDays = dailyRecords.Count(d => d.Status == AttendanceStatus.Absent);
                int lateDays = dailyRecords.Count(d => d.Status == AttendanceStatus.Late);

                double attendancePerc = totalDays > 0
                    ? (double)presentDays / totalDays * 100
                    : 0;

                var gradesData = await _mediator.Send(
                    new GetStudentGradesQuery(student.Oid), cancellationToken);

                double gpaValue = gradesData?.OverallGPA?.GPA ?? 0.0;
                int subjectsCount = gradesData?.SubjectPerformance?.Subjects?.Count ?? 0;

                var recentRecords = dailyRecords
                    .Take(5)
                    .Select(d => new AttendanceHistoryDto
                    {
                        Date = d.Date,
                        DayName = d.Date.DayOfWeek.ToString(),
                        Status = d.Status.ToString()
                    })
                    .ToList();

                var monthlyTrend = dailyRecords
                    .GroupBy(d => new { d.Date.Year, d.Date.Month })
                    .Select(g => new AttendanceChartItemDto
                    {
                        Month = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM"),
                        Percentage = Math.Round((double)g.Count(d => d.Status == AttendanceStatus.Present) / g.Count() * 100, 1)
                    })
                    .OrderBy(m => m.Month)
                    .ToList();

                response.Children.Add(new StudentDashboardDetailDto
                {
                    StudentOid = student.Oid,
                    StudentName = student.FullName,
                    GradeLevel = FormatGradeLevel(student.Class?.Name ?? string.Empty),
                    GPA = Math.Round(gpaValue, 1),
                    Attendance = Math.Round(attendancePerc, 0),
                    SubjectsCount = subjectsCount,
                    AttendanceStats = new ParentAttendanceDashboardDto
                    {
                        OverallAttendancePercentage = Math.Round(attendancePerc, 1),
                        TotalPresentDays = presentDays,
                        TotalAbsentDays = absentDays,
                        TotalLateDays = lateDays,
                        RecentRecords = recentRecords,
                        MonthlyTrend = monthlyTrend, 
                        WarningMessage = attendancePerc < 75 ? "Attendance below 75% - Please ensure regular attendance" : null
                    }
                });
            }
            return response;
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

        private string GetOrdinal(int n) => (n % 100) switch
        {
            11 or 12 or 13 => "th",
            _ => (n % 10) switch { 1 => "st", 2 => "nd", 3 => "rd", _ => "th" }
        };
    }
}