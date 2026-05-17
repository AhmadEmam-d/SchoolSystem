// Application/Features/Parents/Queries/GetParentDashboard/GetParentDashboardQueryHandler.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Parents.DTOs;
using SchoolSystem.Application.Features.StudentGrades.Queries.GetStudentGrades;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Parents.Queries.GetParentDashboard
{
    public class GetParentDashboardQueryHandler : IRequestHandler<GetParentDashboardQuery, ParentDashboardDto>
    {
        private readonly IGenericRepository<Parent> _parentRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<Class> _classRepo;
        private readonly IGenericRepository<Domain.Entities.Attendance> _attendanceRepo;
        private readonly IGenericRepository<HomeworkSubmission> _submissionRepo;
        private readonly IGenericRepository<ExamResult> _examResultRepo;
        private readonly IGenericRepository<Exam> _examRepo;
        private readonly IGenericRepository<Lesson> _lessonRepo;
        private readonly IMediator _mediator;

        public GetParentDashboardQueryHandler(
            IGenericRepository<Parent> parentRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<Class> classRepo,
            IGenericRepository<Domain.Entities.Attendance> attendanceRepo,
            IGenericRepository<HomeworkSubmission> submissionRepo,
            IGenericRepository<ExamResult> examResultRepo,
            IGenericRepository<Exam> examRepo,
            IGenericRepository<Lesson> lessonRepo,
            IMediator mediator)
        {
            _parentRepo = parentRepo;
            _studentRepo = studentRepo;
            _classRepo = classRepo;
            _attendanceRepo = attendanceRepo;
            _submissionRepo = submissionRepo;
            _examResultRepo = examResultRepo;
            _examRepo = examRepo;
            _lessonRepo = lessonRepo;
            _mediator = mediator;
        }

        public async Task<ParentDashboardDto> Handle(GetParentDashboardQuery request, CancellationToken cancellationToken)
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

            var childrenList = new List<ChildInfoDto>();
            var allSubjectScores = new List<SubjectGradeDto>();
            var allRecentActivities = new List<RecentActivityDto>();

            foreach (var student in students)
            {
                var gradesQuery = new GetStudentGradesQuery(student.Oid);
                var gradesData = await _mediator.Send(gradesQuery, cancellationToken);

                var gradeLevel = FormatGradeLevel(student.Class?.Name ?? string.Empty);

                double gpa = gradesData?.OverallGPA?.GPA ?? 0.0;

                var attendancePercentage = await CalculateAttendancePercentage(student.Oid, cancellationToken);

                // ← Fix 2: use ClassOid
                var subjectsCount = await GetSubjectsCount(student.ClassOid, cancellationToken);

                childrenList.Add(new ChildInfoDto
                {
                    Name = student.FullName ?? "Unknown",
                    GradeLevel = gradeLevel,
                    GPA = Math.Round(gpa, 1),
                    Attendance = Math.Round(attendancePercentage, 0),
                    SubjectsCount = subjectsCount
                });

                var subjectScores = await GetStudentSubjectScores(student.Oid, cancellationToken);
                allSubjectScores.AddRange(subjectScores);

                var recentActivities = await GetRecentActivities(student, cancellationToken);
                allRecentActivities.AddRange(recentActivities);
            }

            var subjectPerformance = allSubjectScores
                .GroupBy(s => s.Name)
                .Select(g => new SubjectGradeDto
                {
                    Name = g.Key,
                    Percentage = Math.Round(g.Average(x => x.Percentage), 0)
                })
                .ToList();

            if (!subjectPerformance.Any())
                subjectPerformance.Add(new SubjectGradeDto { Name = "No subjects available", Percentage = 0 });

            // ← Fix 3: pass students list
            var upcomingEvents = await GetUpcomingEvents(students, cancellationToken);

            var topRecentActivities = allRecentActivities
                .OrderByDescending(a => a.TimeAgo)
                .Take(3)
                .ToList();

            if (!topRecentActivities.Any())
                topRecentActivities.Add(new RecentActivityDto
                {
                    Activity = "No recent activities",
                    TimeAgo = "",
                    Status = "N/A"
                });

            return new ParentDashboardDto
            {
                Children = childrenList,
                SubjectPerformance = new SubjectPerformanceDto
                {
                    Subjects = subjectPerformance.Take(4).ToList(),
                    ViewFullReportLink = "/api/reports/full-report"
                },
                UpcomingEvents = upcomingEvents,
                RecentActivities = topRecentActivities
            };
        }

        private async Task<List<SubjectGradeDto>> GetStudentSubjectScores(
            Guid studentOid, CancellationToken cancellationToken)
        {
            var subjectPercentages = new Dictionary<string, List<double>>();

            var examResults = await _examResultRepo.GetAllQueryable()
                .Cast<ExamResult>()
                .Include(er => er.Exam).ThenInclude(e => e!.Subject)
                .Where(er => er.StudentOid == studentOid && er.Percentage.HasValue)
                .ToListAsync(cancellationToken);

            foreach (var exam in examResults)
            {
                var subjectName = exam.Exam?.Subject?.Name ?? "Unknown";
                if (!subjectPercentages.ContainsKey(subjectName))
                    subjectPercentages[subjectName] = new List<double>();
                subjectPercentages[subjectName].Add(exam.Percentage!.Value);
            }

            var submissions = await _submissionRepo.GetAllQueryable()
                .Cast<HomeworkSubmission>()
                .Include(s => s.Homework).ThenInclude(h => h.Subject)
                .Where(s => s.StudentOid == studentOid && s.Grade.HasValue && s.Homework.TotalMarks > 0)
                .ToListAsync(cancellationToken);

            foreach (var submission in submissions)
            {
                var subjectName = submission.Homework?.Subject?.Name ?? "Unknown";
                var percentage = Math.Min((double)(submission.Grade!.Value / (submission.Homework?.TotalMarks ?? 1) * 100), 100);
                if (!subjectPercentages.ContainsKey(subjectName))
                    subjectPercentages[subjectName] = new List<double>();
                subjectPercentages[subjectName].Add(percentage);
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
                    Status = g.Any(a => a.Status == Domain.Enums.AttendanceStatus.Absent)
                        ? Domain.Enums.AttendanceStatus.Absent
                        : g.Any(a => a.Status == Domain.Enums.AttendanceStatus.Late)
                            ? Domain.Enums.AttendanceStatus.Late
                            : Domain.Enums.AttendanceStatus.Present
                })
                .ToList();

            var presentDays = dailyAttendance.Count(d => d.Status == Domain.Enums.AttendanceStatus.Present);
            return dailyAttendance.Any() ? (double)presentDays / dailyAttendance.Count * 100 : 0;
        }

        // ← Fix 2: count by ClassOid from Lesson table
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

            foreach (var submission in recentSubmissions)
                activities.Add(new RecentActivityDto
                {
                    Activity = $"{student.FullName} submitted {submission.Homework?.Title ?? "homework"}",
                    TimeAgo = GetTimeAgo(submission.CreatedAt),
                    Status = submission.Grade.HasValue
                        ? $"Graded: {submission.Grade}/{submission.Homework?.TotalMarks}"
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

            foreach (var deadline in upcomingDeadlines)
                activities.Add(new RecentActivityDto
                {
                    Activity = $"{deadline.Homework?.Title} due for {student.FullName}",
                    TimeAgo = $"Due {deadline.Homework?.DueDate:MMM dd}",
                    Status = "Upcoming"
                });

            return activities;
        }

        // ← Fix 3: query Exam by ClassOid, not ExamResult
        private async Task<List<UpcomingEventDto>> GetUpcomingEvents(
            List<Student> students, CancellationToken cancellationToken)
        {
            var classIds = students.Select(s => s.ClassOid).Distinct().ToList();
            var events = new List<UpcomingEventDto>();

            var exams = await _examRepo.GetAllQueryable()
                .Cast<Exam>()
                .Include(e => e.Subject)
                .Where(e => !e.IsDeleted
                         && classIds.Contains(e.ClassOid)
                         && e.Date >= DateTime.Today
                         && e.Date <= DateTime.Today.AddDays(30))
                .OrderBy(e => e.Date)
                .Take(3)
                .ToListAsync(cancellationToken);

            foreach (var exam in exams)
                events.Add(new UpcomingEventDto
                {
                    Title = $"{exam.Subject?.Name} {exam.Name}",
                    Date = exam.Date.ToString("MMMM dd"),
                    Type = "Exams",
                    Link = "/exams"
                });

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