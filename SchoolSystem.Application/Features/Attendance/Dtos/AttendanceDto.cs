using SchoolSystem.Domain.Enums;

namespace SchoolSystem.Application.Features.Attendance.DTOs
{
    public class AttendanceDto
    {
        public Guid Oid { get; set; }
        public Guid StudentOid { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public Guid ClassOid { get; set; }
        public string ClassName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Remarks { get; set; } = string.Empty;
        public string CheckInTime { get; set; } = string.Empty;
        public string CheckOutTime { get; set; } = string.Empty;
    }

    public class CreateAttendanceDto
    {
        public Guid ClassOid { get; set; }
        public DateTime Date { get; set; }
        public List<StudentAttendanceInputDto> Attendances { get; set; } = new();
    }



    public class UpdateAttendanceDto
    {
        public Guid Oid { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Remarks { get; set; }
        public string? CheckInTime { get; set; }
        public string? CheckOutTime { get; set; }
    }

    public class TodayAttendanceDto
    {
        public int PresentCount { get; set; }
        public int AbsentCount { get; set; }
        public int LateCount { get; set; }
        public int TotalStudents { get; set; }
        public double PresentPercentage { get; set; }
        public List<StudentAttendanceDto> RecentAbsentees { get; set; }= new();
    }

    public class StudentAttendanceDto
    {
        public Guid StudentOid { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class WeeklyAttendanceDto
    {
        public List<DailyAttendanceDto> DailyData { get; set; }=new();
    }

    public class DailyAttendanceDto
    {
        public string Day { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public int Present { get; set; }
        public int Absent { get; set; }
        public int Late { get; set; }
        public int Total { get; set; }
        public double AttendanceRate { get; set; }
    }

    public class MonthlyAttendanceReportDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public string MonthName { get; set; } = string.Empty;
        public double AttendanceRate { get; set; }
        public int TotalAttendance { get; set; }
        public int TotalAbsences { get; set; }
        public int LateArrivals { get; set; }
        public int TotalStudents { get; set; }
        public int SchoolDays { get; set; }
        public List<DailyAttendanceDto> DailyData { get; set; } = new();
    }

    public class StartSessionDto
    {
        public Guid ClassOid { get; set; }
        public Guid LessonOid { get; set; }
        public AttendanceMethod Method { get; set; }
    }

    public class AttendanceSessionResponseDto
    {
        public Guid SessionId { get; set; }
        public Guid ClassOid { get; set; }
        public Guid LessonOid { get; set; }
        public string LessonName { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public AttendanceMethod Method { get; set; }
        public string? QrCodeBase64 { get; set; }
        public List<int>? RandomNumbers { get; set; }
        public List<StudentInfoDto> Students { get; set; }= new();
        public DateTime ExpiresAt { get; set; }
    }

    public class StudentInfoDto
    {
        public Guid StudentOid { get; set; }
        public string StudentName { get; set; } = string.Empty;
    }

    public class SubmitAttendanceDto
    {
        public Guid SessionId { get; set; }
        public List<StudentAttendanceInputDto> AttendanceList { get; set; } = new();
        public int? SelectedNumber { get; set; }
    }

    public class ClassAttendanceStatsDto
    {
        public double AverageAttendance { get; set; }
        public int TotalLessons { get; set; }
        public int CompletedLessons { get; set; }
        public List<StudentAttendanceSummaryDto> StudentSummaries { get; set; } = new();
    }

    public class StudentAttendanceSummaryDto
    {
        public Guid StudentOid { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public double AttendancePercentage { get; set; }
        public int PresentCount { get; set; }
        public int AbsentCount { get; set; }
        public int LateCount { get; set; }
        public string Status { get; set; } = string.Empty;
    }
    public class StartAttendanceSessionDto
    {
        public Guid ClassOid { get; set; }
        public Guid LessonOid { get; set; }
        public AttendanceMethod Method { get; set; }
        public int? CorrectNumber { get; set; }
    }
    public class SubmitAttendanceSessionDto
    {
        public Guid SessionId { get; set; }
        public int? SelectedNumber { get; set; }
        public List<StudentAttendanceInputDto> Attendances { get; set; }=new();
    }
    public class StudentAttendanceInputDto
    {
        public Guid StudentOid { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Remarks { get; set; }
        public string? CheckInTime { get; set; }
    }

    public class StudentSubmitAttendanceDto
    {
        public Guid SessionId { get; set; }
        public int? SelectedNumber { get; set; }  
        public string? Remarks { get; set; }
    }

    public class StudentSubmitAttendanceResponseDto
    {
        public bool Success { get; set; }
        public string Status { get; set; } = string.Empty;
        public string CheckInTime { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
    public enum AttendanceMethod
    {
        Manual = 1,
        QRCode = 2,
        NumberSelection = 3
    }
}