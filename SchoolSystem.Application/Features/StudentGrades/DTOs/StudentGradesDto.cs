using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.StudentGrades.DTOs
{
    public class StudentGradesDashboardDto
    {
        public string Title { get; set; } = "myGradesTitle";
        public string Description { get; set; } = "myGradesDesc";
        public OverallGpaDto OverallGPA { get; set; }
        public GradeTrendDto GradeTrend { get; set; }
        public SubjectPerformanceDto SubjectPerformance { get; set; }
        public List<SubjectDetailedGradeDto> SubjectDetailedGrades { get; set; }
        public ClassRankDto ClassRank { get; set; }
    }

    public class OverallGpaDto
    {
        public double GPA { get; set; }
        public double OverallGrade { get; set; }
    }

    public class GradeTrendDto
    {
        public List<string> Months { get; set; }
        public List<int> Values { get; set; }
    }

    public class SubjectPerformanceDto
    {
        public List<string> Subjects { get; set; }
        public List<int> Grades { get; set; }
    }

    public class SubjectDetailedGradeDto
    {
        public string SubjectName { get; set; }
        public string TeacherName { get; set; }
        public SubjectGradeComponentsDto Components { get; set; }
        public List<ExamGradeDto> Exams { get; set; }
        public List<AssignmentGradeDto> Assignments { get; set; }
    }

    public class SubjectGradeComponentsDto
    {
        public double Exams { get; set; }
        public double Assignments { get; set; }
        public double Participation { get; set; }
        public double Attendance { get; set; }
    }

    public class ExamGradeDto
    {
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public decimal Score { get; set; }
        public decimal TotalMarks { get; set; }
        public double Percentage { get; set; }
    }

    public class AssignmentGradeDto
    {
        public string Title { get; set; }
        public DateTime DueDate { get; set; }
        public decimal? Grade { get; set; }
        public decimal TotalMarks { get; set; }
        public double? Percentage { get; set; }
    }

    public class ClassRankDto
    {
        public int Rank { get; set; }
        public int TotalStudents { get; set; }
        public string Text => $"{Rank}th out of {TotalStudents}";
    }
}