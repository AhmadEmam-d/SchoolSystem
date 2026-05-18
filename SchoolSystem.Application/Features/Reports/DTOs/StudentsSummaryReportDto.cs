using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Reports.DTOs
{
    // Students Summary Report
    public class StudentsSummaryReportDto
    {
        public int TotalStudents { get; set; }
        public int ActiveStudents { get; set; }
        public double ActivePercentage { get; set; }
        public double AvgAttendance { get; set; }
        public double AvgPerformance { get; set; }
        public double AttendanceChange { get; set; }
        public double PerformanceChange { get; set; }
        public double TotalStudentsChange { get; set; }
        public GenderDistributionDto GenderDistribution { get; set; } = new GenderDistributionDto();
        public List<ClassDistributionDto> ClassDistribution { get; set; }= new List<ClassDistributionDto>();
        public StatusDistributionDto StatusDistribution { get; set; }=new StatusDistributionDto();
        public List<StudentReportItemDto> Students { get; set; } = new List<StudentReportItemDto>();
    }

    public class GenderDistributionDto
    {
        public int Male { get; set; }
        public int Female { get; set; }
    }

    public class ClassDistributionDto
    {
        public string ClassName { get; set; } = string.Empty;
        public int StudentCount { get; set; }
    }

    public class StatusDistributionDto
    {
        public int Active { get; set; }
        public int Inactive { get; set; }
        public int Graduated { get; set; }
    }

    public class StudentReportItemDto
    {
        public Guid Oid { get; set; }
        public string FullName { get; set; }=string.Empty;
        public string ClassName { get; set; }= string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public double Attendance { get; set; }
        public double Performance { get; set; }
        public DateTime EnrollmentDate { get; set; }
    }

    // Grades Report
    public class GradesReportDto
    {
        public int TotalStudents { get; set; }
        public double AverageGrade { get; set; }
        public int TopPerformersCount { get; set; }
        public int TopPerformersPercentage { get; set; }
        public List<SubjectPerformanceDto> SubjectPerformance { get; set; }= new List<SubjectPerformanceDto>();
        public List<TopStudentDto> TopStudents { get; set; }=new List<TopStudentDto>();
        public List<HighestGradeBySubjectDto> HighestGradesBySubject { get; set; }= new List<HighestGradeBySubjectDto>();
    }

    public class SubjectPerformanceDto
    {
        public string SubjectName { get; set; }=string.Empty;
        public double Average { get; set; }
        public double Highest { get; set; }
        public double Lowest { get; set; }
        public int TotalStudents { get; set; }
        public double PassRate { get; set; }
    }

    public class TopStudentDto
    {
        public string StudentName { get; set; }= string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public double Average { get; set; }
    }

    public class HighestGradeBySubjectDto
    {
        public string SubjectName { get; set; } = string.Empty;
        public double HighestScore { get; set; }
        public string StudentName { get; set; } = string.Empty;
    }

    // Academic Performance
    public class AcademicPerformanceDto
    {
        public List<SubjectPerformanceSummaryDto> Subjects { get; set; }= new List<SubjectPerformanceSummaryDto>();
    }

    public class SubjectPerformanceSummaryDto
    {
        public string SubjectName { get; set; }=string.Empty;
        public double AverageScore { get; set; }
        public double PassRate { get; set; }
    }

    // Attendance Distribution
    public class AttendanceDistributionDto
    {
        public int Present { get; set; }
        public int Absent { get; set; }
        public int Late { get; set; }
        public double PresentPercentage { get; set; }
        public double AbsentPercentage { get; set; }
        public double LatePercentage { get; set; }
    }

    // Financial Summary
    public class FinancialSummaryDto
    {
        public double TotalIncome { get; set; }
        public double TotalExpenses { get; set; }
        public double NetProfit { get; set; }
        public List<MonthlyFinancialDto> MonthlyData { get; set; }= new List<MonthlyFinancialDto>();
    }

    public class MonthlyFinancialDto
    {
        public string Month { get; set; }=string.Empty;
        public double Income { get; set; }
        public double Expenses { get; set; }
    }

    // Teacher Activity Log
    public class TeacherActivityLogDto
    {
        public Guid TeacherOid { get; set; }
        public string TeacherName { get; set; }= string.Empty;
        public DateTime LastLogin { get; set; }
        public int TotalLogins { get; set; }
        public List<ActivityDto> RecentActivities { get; set; }=new List<ActivityDto>();
    }

    public class ActivityDto
    {
        public string Action { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string Details { get; set; } = string.Empty;
    }

    // Create Report Command DTOs
    public class CreateStudentReportDto
    {
        public Guid StudentOid { get; set; }
        public string ReportType { get; set; } = string.Empty;
    }

    public class CreateTeacherReportDto
    {
        public Guid TeacherOid { get; set; }
        public string ReportType { get; set; } = string.Empty;
    }

    public class CreateFinancialReportDto
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}