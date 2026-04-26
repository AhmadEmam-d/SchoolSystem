// Application/Features/Subjects/DTOs/MySubjectDto.cs
using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Subjects.DTOs
{
    public class MySubjectDto
    {
        public Guid SubjectId { get; set; }
        public string SubjectName { get; set; } = string.Empty;
        public string? TeacherName { get; set; }

        // Statistics
        public int LessonsCount { get; set; }
        public int HomeworksCount { get; set; }
        public int ExamsCount { get; set; }
        public double? AverageGrade { get; set; }

        // Content (for Students/Parents)
        public List<MyLessonDto>? Lessons { get; set; }
        public List<MyHomeworkDto>? Homeworks { get; set; }
        public List<MyExamDto>? Exams { get; set; }

        // For Teachers
        public List<StudentInSubjectDto>? Students { get; set; }
    }

    public class MyLessonDto
    {
        public Guid LessonId { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; } = string.Empty;
        public int MaterialsCount { get; set; }
    }

    public class MyHomeworkDto
    {
        public Guid HomeworkId { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public decimal TotalMarks { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal? MyGrade { get; set; }
        public string? Feedback { get; set; }
    }

    public class MyExamDto
    {
        public Guid ExamId { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public int MaxScore { get; set; }
        public string Status { get; set; } = string.Empty;
        public int? MyScore { get; set; }
    }

    public class StudentInSubjectDto
    {
        public Guid StudentId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public double? AverageGrade { get; set; }
    }
}