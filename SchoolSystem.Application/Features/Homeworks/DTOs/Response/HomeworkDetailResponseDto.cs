namespace SchoolSystem.Application.Features.Homeworks.DTOs.Response
{
    public class HomeworkDetailResponseDto
    {
        public Guid Oid { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Instructions { get; set; }
        public DateTime DueDate { get; set; }
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
        public List<HomeworkAttachmentDto> Attachments { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class HomeworkAttachmentDto
    {
        public Guid Oid { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
    }
}