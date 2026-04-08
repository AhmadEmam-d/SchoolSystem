// Domain/Entities/LessonHomework.cs
using SchoolSystem.Domain.Common;

namespace SchoolSystem.Domain.Entities
{
    public class LessonHomework : BaseEntity
    {
        public string Title { get; set; }                // عنوان الواجب
        public string Description { get; set; }          // وصف الواجب
        public DateTime DueDate { get; set; }            // تاريخ التسليم
        public string Attachments { get; set; }          // المرفقات (JSON)
        public Guid LessonOid { get; set; }
        public Lesson Lesson { get; set; }
    }
}