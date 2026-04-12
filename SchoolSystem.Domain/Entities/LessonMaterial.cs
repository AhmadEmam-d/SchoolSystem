using SchoolSystem.Domain.Common;

namespace SchoolSystem.Domain.Entities
{
    public class LessonMaterial : BaseEntity
    {
        public string Name { get; set; }                
        public string FileUrl { get; set; }           
        public string FileType { get; set; }           
        public long FileSize { get; set; }               
        public Guid LessonOid { get; set; }
        public Lesson Lesson { get; set; }
    }
}