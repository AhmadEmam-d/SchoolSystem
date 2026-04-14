namespace SchoolSystem.Application.Features.Classes.DTOs.Read
{
    public class ClassDetailsDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; }
        public string Level { get; set; }
        public string Subject { get; set; }
        public string Room { get; set; }
        public int TotalLessons { get; set; }
        public int CompletedLessons { get; set; }
        public double AverageAttendance { get; set; }
        public double AverageGrade { get; set; }
        public int UpcomingExams { get; set; }
        public int PendingAssignments { get; set; }
        public List<StudentRosterDto> Students { get; set; }
        public WeeklyScheduleDto WeeklySchedule { get; set; }
    }

    public class StudentRosterDto
    {
        public string Name { get; set; }
        public double Attendance { get; set; }
        public double Grade { get; set; }
        public string Status { get; set; }
    }

    public class WeeklyScheduleDto
    {
        public List<ScheduleItemDto> Sunday { get; set; }
        public List<ScheduleItemDto> Monday { get; set; }
        public List<ScheduleItemDto> Tuesday { get; set; }
        public List<ScheduleItemDto> Wednesday { get; set; }
        public List<ScheduleItemDto> Thursday { get; set; }
    }

    public class ScheduleItemDto
    {
        public string Time { get; set; }
        public string Subject { get; set; }
        public string Room { get; set; }
    }
}