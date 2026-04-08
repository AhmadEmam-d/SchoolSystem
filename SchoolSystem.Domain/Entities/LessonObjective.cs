// Domain/Entities/LessonObjective.cs
using SchoolSystem.Domain.Common;

namespace SchoolSystem.Domain.Entities
{
    public class LessonObjective : BaseEntity
    {
        public string Description { get; set; }          // وصف الهدف
        public int Order { get; set; }                   // الترتيب
        public Guid LessonOid { get; set; }
        public Lesson Lesson { get; set; }
    }
}