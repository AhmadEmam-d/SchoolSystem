// Domain/Entities/HomeworkAttachment.cs
using SchoolSystem.Domain.Common;

namespace SchoolSystem.Domain.Entities
{
    public class HomeworkAttachment : BaseEntity
    {
        public string FileName { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public Guid HomeworkOid { get; set; }
        public Homework Homework { get; set; } = null!;
    }
}