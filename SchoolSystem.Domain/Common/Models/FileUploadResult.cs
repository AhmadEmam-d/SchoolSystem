// Application/Common/Models/FileUploadResult.cs
namespace SchoolSystem.Application.Common.Models
{
    public class FileUploadResult
    {
        public string Name { get; set; }
        public string FileUrl { get; set; }
        public string FileType { get; set; }
        public long FileSize { get; set; }
        public string EntityType { get; set; }  // ✅ Which entity this belongs to
        public Guid? EntityId { get; set; }      // ✅ ID of the entity
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}