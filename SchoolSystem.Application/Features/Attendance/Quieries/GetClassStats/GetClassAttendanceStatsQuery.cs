// Application/Features/Attendance/Queries/GetClassStats/GetClassAttendanceStatsQuery.cs
using MediatR;

namespace SchoolSystem.Application.Features.Attendance.Queries.GetClassStats
{
    public class GetClassAttendanceStatsQuery : IRequest<ClassAttendanceStatsDto>
    {
        public Guid ClassOid { get; set; }
    }

    public class ClassAttendanceStatsDto
    {
        public double AverageAttendance { get; set; }
        public int TotalLessons { get; set; }
        public int CompletedLessons { get; set; }
        public List<StudentAttendanceSummaryDto> StudentSummaries { get; set; }
    }

    public class StudentAttendanceSummaryDto
    {
        public Guid StudentOid { get; set; }
        public string StudentName { get; set; }
        public double AttendancePercentage { get; set; }
        public int PresentCount { get; set; }
        public int AbsentCount { get; set; }
        public int LateCount { get; set; }
        public string Status { get; set; }
    }
}