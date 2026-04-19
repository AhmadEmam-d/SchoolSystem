namespace SchoolSystem.Application.Features.Homeworks.DTOs
{
    public class HomeworkListResponseDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public string SubjectName { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public int SubmittedCount { get; set; }
        public int TotalStudents { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal TotalMarks { get; set; }
    }

    public class HomeworkDetailResponseDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Instructions { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime AssignedDate { get; set; }
        public decimal TotalMarks { get; set; }
        public string SubmissionType { get; set; } = string.Empty;
        public bool AllowLateSubmissions { get; set; }
        public bool NotifyParents { get; set; }
        public string Status { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public string SubjectName { get; set; } = string.Empty;
        public string TeacherName { get; set; } = string.Empty;
        public int SubmittedCount { get; set; }
        public int TotalStudents { get; set; }
        public int PendingCount { get; set; }
        public int GradedCount { get; set; }
        public int LateCount { get; set; }
        public List<HomeworkAttachmentDto> Attachments { get; set; } = new();
    }

    public class HomeworkSubmissionResponseDto
    {
        public Guid Id { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string StudentEmail { get; set; } = string.Empty;
        public string? Content { get; set; }
        public string? AttachmentUrl { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public decimal? Grade { get; set; }
        public string? Feedback { get; set; }
        public string Status { get; set; } = string.Empty;
        public bool IsLate { get; set; }
    }

    public class HomeworkGradeReportDto
    {
        public double AverageGrade { get; set; }
        public decimal HighestGrade { get; set; }
        public decimal LowestGrade { get; set; }
        public double PassRate { get; set; }
        public int TotalSubmissions { get; set; }
        public int GradedCount { get; set; }
        public Dictionary<string, int> GradeDistribution { get; set; } = new();
        public List<StudentGradeDto> StudentGrades { get; set; } = new();
    }

    public class StudentGradeDto
    {
        public int Rank { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public decimal? Grade { get; set; }
        public string LetterGrade { get; set; } = string.Empty;
        public string Performance { get; set; } = string.Empty;
    }
}