// Application/Features/Parents/DTOs/ParentDashboardDto.cs
namespace SchoolSystem.Application.Features.Parents.DTOs
{
    public class ParentDashboardDto
    {
        public List<ChildInfoDto> Children { get; set; }
        public SubjectPerformanceDto SubjectPerformance { get; set; }
        public List<UpcomingEventDto> UpcomingEvents { get; set; }
        public List<RecentActivityDto> RecentActivities { get; set; }
    }

    public class ChildInfoDto
    {
        public string Name { get; set; }           // Bart Simpson, Lisa Simpson
        public string GradeLevel { get; set; }      // 10th
        public double GPA { get; set; }             // 2.8
        public double Attendance { get; set; }      // 85%
        public int SubjectsCount { get; set; }      // 4
    }

    public class SubjectPerformanceDto
    {
        public List<SubjectGradeDto> Subjects { get; set; }
        public string ViewFullReportLink { get; set; }
    }

    public class SubjectGradeDto
    {
        public string Name { get; set; }            // Mathematics, Science, History, English
        public double Percentage { get; set; }      // 78, 82, 75, 80
    }

    public class UpcomingEventDto
    {
        public string Title { get; set; }            // Math Mid-Term Exam
        public string Date { get; set; }             // March 15
        public string Type { get; set; }             // Exams, Homework, Meeting
        public string Link { get; set; }             // /exams, /homework, /meeting
    }

    public class RecentActivityDto
    {
        public string Activity { get; set; }         // Submitted Math Homework
        public string TimeAgo { get; set; }          // 2 days ago
        public string Status { get; set; }           // Completed, Scored, Absent
    }
    public class MyChildrenDto
    {
        public List<ChildDetailsDto> Children { get; set; }
    }

    public class ChildDetailsDto
    {
        public Guid ChildId { get; set; }
        public string Name { get; set; }           // Bart Simpson, Lisa Simpson
        public string GradeLevel { get; set; }      // 10th
        public double GPA { get; set; }             // 2.8
        public double Attendance { get; set; }      // 85%
        public int SubjectsCount { get; set; }      // 4
    }
}