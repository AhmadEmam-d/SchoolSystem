using SchoolSystem.Application.Features.Teachers.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Subjects.DTOs
{
    public class SubjectResponseDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public int TeachersCount { get; set; } 
        public int ActiveClassesCount { get; set; }
        public List<TeacherBasicDto> Teachers { get; set; } = new List<TeacherBasicDto>();
        public class TeacherBasicDto
        {
            public Guid Oid { get; set; }
            public string FullName { get; set; }= string.Empty;
            public string Email { get; set; }=string.Empty;
        }
    }
    public class StudentSubjectDto
    {
        public Guid SubjectId { get; set; }
        public string SubjectName { get; set; } = string.Empty;
        public string? TeacherName { get; set; }

        public int LessonsCount { get; set; }
        public int HomeworksCount { get; set; }
        public int ExamsCount { get; set; }
        public int PendingHomeworks { get; set; }
        public int OverdueHomeworks { get; set; }
        public double? AverageGrade { get; set; }

        public List<StudentLessonDto> Lessons { get; set; } = new();
        public List<StudentHomeworkDto> Homeworks { get; set; } = new();
        public List<StudentExamDto> Exams { get; set; } = new();
    }

    public class StudentLessonDto
    {
        public Guid LessonId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; } = string.Empty;
        public int MaterialsCount { get; set; }
        public List<MaterialDto> Materials { get; set; } = new();
    }

    public class StudentHomeworkDto
    {
        public Guid HomeworkId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public decimal TotalMarks { get; set; }
        public string Status { get; set; } = string.Empty;
        public bool IsOverdue { get; set; }
        public int DaysRemaining { get; set; }
        public decimal? MyGrade { get; set; }
        public string? MySubmissionUrl { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public string? Feedback { get; set; }
    }

    public class StudentExamDto
    {
        public Guid ExamId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan Duration { get; set; }
        public int MaxScore { get; set; }
        public int PassingScore { get; set; }
        public string Status { get; set; } = string.Empty;
        public int? MyScore { get; set; }
        public int? MyPercentage { get; set; }
        public string? MyGrade { get; set; }
        public bool? IsPassed { get; set; }
    }

    public class MaterialDto
    {
        public Guid MaterialId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public long FileSize { get; set; }
    }
}

