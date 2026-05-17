// Application/Common/Models/FileUploadResult.cs
namespace SchoolSystem.Application.Common.Models
{
    public class FileUploadResult
    {
        public string Name { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string EntityType { get; set; } = string.Empty;
        public Guid? EntityId { get; set; }   
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}