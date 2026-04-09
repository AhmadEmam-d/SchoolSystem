using SchoolSystem.Domain.Common;

namespace SchoolSystem.Domain.Entities
{
    public class LessonObjective : BaseEntity
    {
        public string Description { get; set; }       
        public int Order { get; set; }                 
        public Guid LessonOid { get; set; }
        public Lesson Lesson { get; set; }
    }
}