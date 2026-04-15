// Application/Features/Homeworks/DTOs/Update/UpdateHomeworkDto.cs
namespace SchoolSystem.Application.Features.Homeworks.DTOs.Update
{
    public class UpdateHomeworkDto
    {
        public Guid Oid { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Instructions { get; set; }
        public DateTime DueDate { get; set; }
        public decimal TotalMarks { get; set; }
        public string SubmissionType { get; set; } = "File";
        public bool AllowLateSubmissions { get; set; }
        public bool NotifyParents { get; set; }
        public Guid ClassId { get; set; }
        public Guid SubjectId { get; set; }
        public List<UpdateHomeworkAttachmentDto> Attachments { get; set; } = new();
    }

    public class UpdateHomeworkAttachmentDto
    {
        public Guid? Oid { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public bool IsDeleted { get; set; }
    }
}