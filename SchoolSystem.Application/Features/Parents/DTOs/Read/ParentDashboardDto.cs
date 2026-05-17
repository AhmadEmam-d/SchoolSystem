// Application/Features/Parents/DTOs/ParentDashboardDto.cs
namespace SchoolSystem.Application.Features.Parents.DTOs
{
    public class ParentDashboardDto
    {
        public List<ChildInfoDto> Children { get; set; }=new List<ChildInfoDto>();
        public SubjectPerformanceDto SubjectPerformance { get; set; }= new SubjectPerformanceDto();
        public List<UpcomingEventDto> UpcomingEvents { get; set; } = new List<UpcomingEventDto>();
        public List<RecentActivityDto> RecentActivities { get; set; } = new List<RecentActivityDto>();
    }

    public class ChildInfoDto
    {
        public string Name { get; set; } = string.Empty;        
        public string GradeLevel { get; set; }=string.Empty;
        public double GPA { get; set; }
        public double Attendance { get; set; }  
        public int SubjectsCount { get; set; }  
    }

    public class SubjectPerformanceDto
    {
        public List<SubjectGradeDto> Subjects { get; set; }=new List<SubjectGradeDto>();
        public string ViewFullReportLink { get; set; } = string.Empty;
    }

    public class SubjectGradeDto
    {
        public string Name { get; set; } = string.Empty;
        public double Percentage { get; set; }      
    }

    public class UpcomingEventDto
    {
        public string Title { get; set; } = string.Empty;            
        public string Date { get; set; } = string.Empty;            
        public string Type { get; set; } = string.Empty;            
        public string Link { get; set; } = string.Empty;             
    }

    public class RecentActivityDto
    {
        public string Activity { get; set; } = string.Empty;
        public string TimeAgo { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
    public class MyChildrenDto
    {
        public List<ChildDetailsDto> Children { get; set; } = new List<ChildDetailsDto>();
    }

    public class ChildDetailsDto
    {
        public Guid ChildId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string GradeLevel { get; set; } = string.Empty;
        public double GPA { get; set; } 
        public double Attendance { get; set; }
        public int SubjectsCount { get; set; } 
    }
    public class ParentAttendanceDashboardDto
    {
        public double OverallAttendancePercentage { get; set; }
        public int TotalPresentDays { get; set; }
        public int TotalAbsentDays { get; set; }
        public int TotalLateDays { get; set; }

        public List<AttendanceChartItemDto> MonthlyTrend { get; set; } = new();

        public List<AttendanceHistoryDto> RecentRecords { get; set; } = new();

        public string? WarningMessage { get; set; }
    }
    
    public class AttendanceChartItemDto
    {
        public string Month { get; set; }= string.Empty;
        public double Percentage { get; set; }
    }

    public class AttendanceHistoryDto
    {
        public DateTime Date { get; set; }
        public string DayName { get; set; }=string.Empty;
        public string Status { get; set; }= string.Empty;
    }

    public class ParentFullDashboardDto
    {
        public string ParentName { get; set; } = string.Empty;
        public List<StudentDashboardDetailDto> Children { get; set; } = new();
    }

    public class StudentDashboardDetailDto
    {
        public Guid StudentOid { get; set; }
        public string StudentName { get; set; } =string.Empty;
        public string GradeLevel { get; set; }= string.Empty;
        public double GPA { get; set; }
        public double Attendance { get; set; }
        public int SubjectsCount { get; set; }
        public ParentAttendanceDashboardDto AttendanceStats { get; set; } = new ParentAttendanceDashboardDto();
    }
    public class StudentHomeworkDto
    {
        public Guid StudentOid { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string SubjectName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public string Status { get; set; }=string.Empty;
        public decimal? Grade { get; set; }
        public decimal TotalMarks { get; set; }
    }
    public class ChildScheduleDto
    {
        public Guid ChildId { get; set; }
        public string ChildName { get; set; } = string.Empty;
        public List<ScheduleDayDto> WeeklySchedule { get; set; }= new List<ScheduleDayDto>();
        public List<UpcomingClassDto> TodayClasses { get; set; }=new List<UpcomingClassDto>();
        public List<UpcomingClassDto> TomorrowClasses { get; set; } = new List<UpcomingClassDto>();
    }

    public class ScheduleDayDto
    {
        public string DayName { get; set; } = string.Empty;
        public string DayNameAr { get; set; } = string.Empty;
        public List<ClassScheduleDto> Classes { get; set; } = new List<ClassScheduleDto>();
    }

    public class ClassScheduleDto
    {
        public string SubjectName { get; set; }= string.Empty;
        public string SubjectNameAr { get; set; }= string.Empty;
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public string TeacherName { get; set; } = string.Empty;
        public string Period { get; set; } =string.Empty; 
    }

    public class UpcomingClassDto
    {
        public Guid SubjectId { get; set; }
        public string SubjectName { get; set; }=string.Empty;
        public string SubjectNameAr { get; set; }= string.Empty;    
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public string TeacherName { get; set; } = string.Empty;
        public DateTime ClassDate { get; set; }
        public string Status { get; set; } = string.Empty; // Upcoming, In Progress, Completed
    }
}