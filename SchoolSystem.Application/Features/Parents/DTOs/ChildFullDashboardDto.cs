using SchoolSystem.Application.Features.Parents.DTOs;

public class ChildFullDashboardDto
{
    public Guid StudentOid { get; set; }
    public string StudentName { get; set; }
    public string GradeLevel { get; set; }
    public double GPA { get; set; }
    public double Attendance { get; set; }
    public int SubjectsCount { get; set; }
    public SubjectPerformanceDto SubjectPerformance { get; set; }
    public List<UpcomingEventDto> UpcomingEvents { get; set; }
    public List<RecentActivityDto> RecentActivities { get; set; }
}

public class ChildrenFullDashboardDto
{
    public string ParentName { get; set; }
    public List<ChildFullDashboardDto> Children { get; set; } = new();
}