namespace SchoolSystem.Application.Features.Classes.DTOs.Read
{
    public class StudentBasicInfoDto
    {
        public Guid Oid { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
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
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
    }

    public class HomeworkInfoDto
    {
        public Guid Oid { get; set; }
        public string Title { get; set; }
        public DateTime DueDate { get; set; }
        public string Status { get; set; }
        public decimal? Grade { get; set; }
    }

    public class ExamInfoDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public int? Score { get; set; }
        public string Grade { get; set; }
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
        public string Status { get; set; }
        public string Remarks { get; set; }
    }
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