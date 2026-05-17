using SchoolSystem.Domain.Common;

namespace SchoolSystem.Domain.Entities
{
    public class LessonHomework : BaseEntity
    {
        public string Title { get; set; } = string.Empty;   
        public string Description { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }        
        public string Attachments { get; set; } = string.Empty;
        public Guid LessonOid { get; set; }
        public Lesson? Lesson { get; set; }
    }
}