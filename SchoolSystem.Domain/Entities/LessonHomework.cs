using SchoolSystem.Domain.Common;

namespace SchoolSystem.Domain.Entities
{
    public class LessonHomework : BaseEntity
    {
        public string Title { get; set; }               
        public string Description { get; set; }      
        public DateTime DueDate { get; set; }        
        public string Attachments { get; set; }        
        public Guid LessonOid { get; set; }
        public Lesson Lesson { get; set; }
    }
}