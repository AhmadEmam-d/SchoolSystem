// Domain/Entities/LessonMaterial.cs
using SchoolSystem.Domain.Common;

namespace SchoolSystem.Domain.Entities
{
    public class LessonMaterial : BaseEntity
    {
        public string Name { get; set; }                 // اسم المادة
        public string FileUrl { get; set; }              // رابط الملف
        public string FileType { get; set; }             // نوع الملف (PDF, DOC, etc.)
        public long FileSize { get; set; }               // حجم الملف بالبايت
        public Guid LessonOid { get; set; }
        public Lesson Lesson { get; set; }
    }
}