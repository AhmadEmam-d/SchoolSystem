using SchoolSystem.Application.Features.Parents.DTOs;

public class ChildFullDashboardDto
{
    public Guid StudentOid { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string GradeLevel { get; set; }= string.Empty;
    public double GPA { get; set; }
    public double Attendance { get; set; }
    public int SubjectsCount { get; set; }
    public SubjectPerformanceDto SubjectPerformance { get; set; } = new();
    public List<UpcomingEventDto> UpcomingEvents { get; set; } = new();
    public List<RecentActivityDto> RecentActivities { get; set; } = new(); 
}

public class ChildrenFullDashboardDto
{
    public string ParentName { get; set; }=string.Empty;
    public List<ChildFullDashboardDto> Children { get; set; } = new();
}