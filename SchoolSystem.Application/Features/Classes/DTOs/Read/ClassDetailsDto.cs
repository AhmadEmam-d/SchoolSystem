namespace SchoolSystem.Application.Features.Classes.DTOs.Read
{
    public class StudentBasicInfoDto
    {
        public Guid Oid { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public StudentDetailsDto Details { get; set; } = new StudentDetailsDto();
    }

    public class StudentDetailsDto
    {
        public List<LessonInfoDto> Lessons { get; set; } = new List<LessonInfoDto>();
        public List<HomeworkInfoDto> Homeworks { get; set; } = new List<HomeworkInfoDto>();
        public List<ExamInfoDto> Exams { get; set; } = new List<ExamInfoDto>();
        public AttendanceInfoDto Attendance { get; set; } = new AttendanceInfoDto();
    }

    public class LessonInfoDto
    {
        public Guid Oid { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class HomeworkInfoDto
    {
        public Guid Oid { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal? Grade { get; set; }
    }

    public class ExamInfoDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public int? Score { get; set; }
        public string Grade { get; set; } = string.Empty;
    }

    public class AttendanceInfoDto
    {
        public int PresentCount { get; set; }
        public int AbsentCount { get; set; }
        public int LateCount { get; set; }
        public double AttendancePercentage { get; set; }
        public List<AttendanceRecordDto> RecentRecords { get; set; } = new List<AttendanceRecordDto>();
    }

    public class AttendanceRecordDto
    {
        public DateTime Date { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Remarks { get; set; } = string.Empty;
    }
    public class ClassDetailsDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Room { get; set; } = string.Empty;
        public int TotalLessons { get; set; }
        public int CompletedLessons { get; set; }
        public double AverageAttendance { get; set; }
        public double AverageGrade { get; set; }
        public int UpcomingExams { get; set; }
        public int PendingAssignments { get; set; }
        public List<StudentRosterDto> Students { get; set; }= new List<StudentRosterDto>();
        public WeeklyScheduleDto WeeklySchedule { get; set; }=new WeeklyScheduleDto();
    }

    public class StudentRosterDto
    {
        public string Name { get; set; } = string.Empty;
        public double Attendance { get; set; }
        public double Grade { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class WeeklyScheduleDto
    {
        public List<ScheduleItemDto> Sunday { get; set; } = new List<ScheduleItemDto>();
        public List<ScheduleItemDto> Monday { get; set; } = new List<ScheduleItemDto>();
        public List<ScheduleItemDto> Tuesday { get; set; } = new List<ScheduleItemDto>();
        public List<ScheduleItemDto> Wednesday { get; set; } = new List<ScheduleItemDto>();
        public List<ScheduleItemDto> Thursday { get; set; } = new List<ScheduleItemDto>();
    }

    public class ScheduleItemDto
    {
        public string Time { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Room { get; set; } = string.Empty;
    }
}