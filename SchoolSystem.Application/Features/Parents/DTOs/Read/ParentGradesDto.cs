using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Parents.DTOs.Read
{
        // ── Endpoint 1: GET /api/parents/grades/children ──
        public class ChildGradesSummaryDto
        {
            public Guid StudentOid { get; set; }
            public string StudentName { get; set; } = string.Empty;
    }

        // ── Endpoint 2: GET /api/parents/grades/{studentId} ──
        public class StudentGradesFullDto
        {
            public Guid StudentOid { get; set; }
            public string StudentName { get; set; }= string.Empty;
            public GradeSummaryDto Summary { get; set; } = new();   
            public List<GradeTrendDto> GradeTrend { get; set; } = new();
            public List<SubjectPerformanceDetailDto> SubjectPerformance { get; set; } = new();
        }

        public class GradeSummaryDto
        {
            public double GPA { get; set; }              // StudentReport.AverageGrade
            public double OverallGrade { get; set; }     // StudentReport.AverageGrade
            public string LetterGrade { get; set; } =string.Empty;     // ExamResult.Grade (most recent)
            public int ClassRank { get; set; }            // position by AverageGrade in class
            public int TotalStudentsInClass { get; set; } // Class.Students.Count
        }

        public class GradeTrendDto
        {
            public string Month { get; set; } = string.Empty;             // "Sep", "Oct" ...
            public double AverageScore { get; set; }      // ExamResult.Percentage avg per month
        }

        public class SubjectPerformanceDetailDto
        {
            public string SubjectName { get; set; } = string.Empty;
            public double SubjectAverage { get; set; }   // ExamResult.Percentage avg per subject
            public string LetterGrade { get; set; } = string.Empty;      // ExamResult.Grade most recent per subject
            public List<ExamGradeItemDto> Exams { get; set; } = new();
            public List<AssignmentGradeItemDto> Assignments { get; set; } = new();
        }

        public class ExamGradeItemDto
        {
            public string ExamName { get; set; } = string.Empty;          // Exam.Name
            public int Score { get; set; }                // ExamResult.Score
            public int MaxScore { get; set; }             // Exam.MaxScore
        }

        public class AssignmentGradeItemDto
        {
            public string AssignmentName { get; set; } = string.Empty;    // Homework.Title
            public decimal? Score { get; set; }           // HomeworkSubmission.Grade
            public decimal MaxScore { get; set; }         // Homework.TotalMarks
        }
}
