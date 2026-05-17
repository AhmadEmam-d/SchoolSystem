using SchoolSystem.Domain.Common;

namespace SchoolSystem.Domain.Entities
{
    public class LessonMaterial : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public long FileSize { get; set; }               
        public Guid LessonOid { get; set; }
        public Lesson? Lesson { get; set; }
    }
}