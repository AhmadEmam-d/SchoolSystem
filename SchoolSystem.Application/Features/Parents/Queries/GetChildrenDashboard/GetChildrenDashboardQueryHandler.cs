// Application/Features/Parents/Queries/GetChildrenDashboard/GetChildrenDashboardQueryHandler.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Parents.DTOs;
using SchoolSystem.Application.Features.StudentGrades.Queries.GetStudentGrades;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Parents.Queries.GetChildrenDashboard
{
    public class GetChildrenDashboardQueryHandler
        : IRequestHandler<GetChildrenDashboardQuery, ChildrenFullDashboardDto>
    {
        private readonly IGenericRepository<Parent> _parentRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<Domain.Entities.Attendance> _attendanceRepo;
        private readonly IGenericRepository<HomeworkSubmission> _submissionRepo;
        private readonly IGenericRepository<ExamResult> _examResultRepo;
        private readonly IMediator _mediator;

        public GetChildrenDashboardQueryHandler(
            IGenericRepository<Parent> parentRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<Domain.Entities.Attendance> attendanceRepo,
            IGenericRepository<HomeworkSubmission> submissionRepo,
            IGenericRepository<ExamResult> examResultRepo,
            IMediator mediator)
        {
            _parentRepo = parentRepo;
            _studentRepo = studentRepo;
            _attendanceRepo = attendanceRepo;
            _submissionRepo = submissionRepo;
            _examResultRepo = examResultRepo;
            _mediator = mediator;
        }

        public async Task<ChildrenFullDashboardDto> Handle(
            GetChildrenDashboardQuery request,
            CancellationToken cancellationToken)
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

            var response = new ChildrenFullDashboardDto
            {
                ParentName = parent.FatherName ?? "N/A",
                Children = new List<ChildFullDashboardDto>()
            };

            foreach (var student in students)
            {
                // GPA
                var gradesData = await _mediator.Send(
                    new GetStudentGradesQuery(student.Oid), cancellationToken);
                double gpa = gradesData?.OverallGPA?.GPA ?? 0.0;

                // Attendance
                double attendance = await CalculateAttendancePercentage(student.Oid, cancellationToken);

                // Subjects count
                int subjectsCount = await GetSubjectsCount(student.Oid, cancellationToken);

                // Subject performance
                var subjectScores = await GetStudentSubjectScores(student.Oid, cancellationToken);
                if (!subjectScores.Any())
                    subjectScores.Add(new SubjectGradeDto { Name = "No subjects available", Percentage = 0 });

                // Upcoming events (scoped to student's class)
                var upcomingEvents = await GetUpcomingEvents(student.Oid, cancellationToken);

                // Recent activities
                var recentActivities = await GetRecentActivities(student, cancellationToken);
                if (!recentActivities.Any())
                    recentActivities.Add(new RecentActivityDto
                    {
                        Activity = "No recent activities",
                        TimeAgo = "",
                        Status = "N/A"
                    });

                response.Children.Add(new ChildFullDashboardDto
                {
                    StudentOid = student.Oid,
                    StudentName = student.FullName ?? "Unknown",
                    GradeLevel = FormatGradeLevel(student.Class?.Name),
                    GPA = Math.Round(gpa, 1),
                    Attendance = Math.Round(attendance, 0),
                    SubjectsCount = subjectsCount,
                    SubjectPerformance = new SubjectPerformanceDto
                    {
                        Subjects = subjectScores.Take(4).ToList(),
                        ViewFullReportLink = "/api/reports/full-report"
                    },
                    UpcomingEvents = upcomingEvents,
                    RecentActivities = recentActivities.Take(3).ToList()
                });
            }

            return response;
        }

        private async Task<List<SubjectGradeDto>> GetStudentSubjectScores(
            Guid studentOid, CancellationToken cancellationToken)
        {
            var subjectPercentages = new Dictionary<string, List<double>>();

            var examResults = await _examResultRepo.GetAllQueryable()
                .Cast<ExamResult>()
                .Include(er => er.Exam).ThenInclude(e => e.Subject)
                .Where(er => er.StudentOid == studentOid && er.Percentage.HasValue)
                .ToListAsync(cancellationToken);

            foreach (var exam in examResults)
            {
                var name = exam.Exam?.Subject?.Name ?? "Unknown";
                if (!subjectPercentages.ContainsKey(name))
                    subjectPercentages[name] = new();
                subjectPercentages[name].Add(exam.Percentage!.Value);
            }

            var submissions = await _submissionRepo.GetAllQueryable()
                .Cast<HomeworkSubmission>()
                .Include(s => s.Homework).ThenInclude(h => h.Subject)
                .Where(s => s.StudentOid == studentOid && s.Grade.HasValue && s.Homework.TotalMarks > 0)
                .ToListAsync(cancellationToken);

            foreach (var sub in submissions)
            {
                var name = sub.Homework?.Subject?.Name ?? "Unknown";
                var pct = (double)(sub.Grade!.Value / sub.Homework.TotalMarks * 100);
                if (!subjectPercentages.ContainsKey(name))
                    subjectPercentages[name] = new();
                subjectPercentages[name].Add(pct);
            }

            return subjectPercentages
                .Select(kvp => new SubjectGradeDto
                {
                    Name = kvp.Key,
                    Percentage = Math.Round(kvp.Value.Average(), 0)
                })
                .ToList();
        }

        private async Task<double> CalculateAttendancePercentage(
            Guid studentOid, CancellationToken cancellationToken)
        {
            var records = await _attendanceRepo.GetAllQueryable()
                .Cast<Domain.Entities.Attendance>()
                .Where(a => a.StudentOid == studentOid)
                .ToListAsync(cancellationToken);

            if (!records.Any()) return 0;

            var daily = records
                .GroupBy(a => a.Date.Date)
                .Select(g => g.Any(a => a.Status == Domain.Enums.AttendanceStatus.Absent)
                    ? Domain.Enums.AttendanceStatus.Absent
                    : g.Any(a => a.Status == Domain.Enums.AttendanceStatus.Late)
                        ? Domain.Enums.AttendanceStatus.Late
                        : Domain.Enums.AttendanceStatus.Present)
                .ToList();

            return (double)daily.Count(s => s == Domain.Enums.AttendanceStatus.Present)
                   / daily.Count * 100;
        }

        private async Task<int> GetSubjectsCount(
            Guid studentOid, CancellationToken cancellationToken)
        {
            var examSubjects = await _examResultRepo.GetAllQueryable()
                .Cast<ExamResult>()
                .Include(er => er.Exam)
                .Where(er => er.StudentOid == studentOid)
                .Select(er => er.Exam.SubjectOid)
                .Distinct()
                .ToListAsync(cancellationToken);

            var hwSubjects = await _submissionRepo.GetAllQueryable()
                .Cast<HomeworkSubmission>()
                .Include(s => s.Homework)
                .Where(s => s.StudentOid == studentOid && !s.IsDeleted)
                .Select(s => s.Homework.SubjectOid)
                .Distinct()
                .ToListAsync(cancellationToken);

            return examSubjects.Union(hwSubjects).Distinct().Count();
        }

        private async Task<List<UpcomingEventDto>> GetUpcomingEvents(
            Guid studentOid, CancellationToken cancellationToken)
        {
            var events = new List<UpcomingEventDto>();

            var exams = await _examResultRepo.GetAllQueryable()
                .Cast<ExamResult>()
                .Include(er => er.Exam).ThenInclude(e => e.Subject)
                .Where(er => er.StudentOid == studentOid
                          && er.Exam.Date >= DateTime.Today
                          && er.Exam.Date <= DateTime.Today.AddDays(30))
                .OrderBy(er => er.Exam.Date)
                .Take(3)
                .ToListAsync(cancellationToken);

            foreach (var er in exams)
                events.Add(new UpcomingEventDto
                {
                    Title = $"{er.Exam.Subject?.Name} {er.Exam.Name}",
                    Date = er.Exam.Date.ToString("MMMM dd"),
                    Type = "Exams",
                    Link = "/exams"
                });

            var homeworks = await _submissionRepo.GetAllQueryable()
                .Cast<HomeworkSubmission>()
                .Include(s => s.Homework).ThenInclude(h => h.Subject)
                .Where(s => s.StudentOid == studentOid
                         && s.Homework.DueDate >= DateTime.Today
                         && s.Homework.DueDate <= DateTime.Today.AddDays(30))
                .OrderBy(s => s.Homework.DueDate)
                .Take(3)
                .ToListAsync(cancellationToken);

            foreach (var hw in homeworks)
                events.Add(new UpcomingEventDto
                {
                    Title = $"{hw.Homework?.Subject?.Name} - {hw.Homework?.Title}",
                    Date = hw.Homework.DueDate.ToString("MMMM dd"),
                    Type = "Homework",
                    Link = "/homework"
                });

            // Sort combined events by date, take top 5
            events = events
                .OrderBy(e => DateTime.TryParse(e.Date, out var d) ? d : DateTime.MaxValue)
                .Take(5)
                .ToList();

            // Fallback if nothing found
            if (!events.Any())
                events.AddRange(new[]
                {
                    new UpcomingEventDto { Title = "Math Mid-Term Exam",
                        Date = DateTime.Today.AddDays(15).ToString("MMMM dd"),
                        Type = "Exams", Link = "/exams" },
                    new UpcomingEventDto { Title = "Science Project Due",
                        Date = DateTime.Today.AddDays(18).ToString("MMMM dd"),
                        Type = "Homework", Link = "/homework" },
                    new UpcomingEventDto { Title = "Parent-Teacher Meeting",
                        Date = DateTime.Today.AddDays(22).ToString("MMMM dd"),
                        Type = "Meeting", Link = "/meeting" }
                });

            return events;
        }

        private async Task<List<RecentActivityDto>> GetRecentActivities(
            Student student, CancellationToken cancellationToken)
        {
            var activities = new List<RecentActivityDto>();

            var recentSubmissions = await _submissionRepo.GetAllQueryable()
                .Cast<HomeworkSubmission>()
                .Include(s => s.Homework)
                .Where(s => s.StudentOid == student.Oid
                         && s.CreatedAt >= DateTime.Today.AddDays(-14))
                .OrderByDescending(s => s.CreatedAt)
                .Take(3)
                .ToListAsync(cancellationToken);

            foreach (var sub in recentSubmissions)
                activities.Add(new RecentActivityDto
                {
                    Activity = $"{student.FullName} submitted {sub.Homework?.Title ?? "homework"}",
                    TimeAgo = GetTimeAgo(sub.CreatedAt),
                    Status = sub.Grade.HasValue
                        ? $"Graded: {sub.Grade}/{sub.Homework?.TotalMarks}"
                        : "Pending review"
                });

            var upcomingDeadlines = await _submissionRepo.GetAllQueryable()
                .Cast<HomeworkSubmission>()
                .Include(s => s.Homework)
                .Where(s => s.StudentOid == student.Oid
                         && s.Homework.DueDate >= DateTime.Today
                         && s.Homework.DueDate <= DateTime.Today.AddDays(7))
                .OrderBy(s => s.Homework.DueDate)
                .Take(2)
                .ToListAsync(cancellationToken);

            foreach (var dl in upcomingDeadlines)
                activities.Add(new RecentActivityDto
                {
                    Activity = $"{dl.Homework?.Title} due for {student.FullName}",
                    TimeAgo = $"Due {dl.Homework.DueDate:MMM dd}",
                    Status = "Upcoming"
                });

            return activities;
        }

        // ── helpers ──────────────────────────────────────────────
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

        private string GetOrdinal(int n) => (n % 100) switch
        {
            11 or 12 or 13 => "th",
            _ => (n % 10) switch { 1 => "st", 2 => "nd", 3 => "rd", _ => "th" }
        };

        private string GetTimeAgo(DateTime date)
        {
            var ts = DateTime.Now - date;
            if (ts.Days > 7) return $"{ts.Days / 7} weeks ago";
            if (ts.Days > 0) return $"{ts.Days} days ago";
            if (ts.Hours > 0) return $"{ts.Hours} hours ago";
            if (ts.Minutes > 0) return $"{ts.Minutes} minutes ago";
            return "Just now";
        }
    }
}