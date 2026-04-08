// Domain/Entities/Lesson.cs
using SchoolSystem.Domain.Common;
using SchoolSystem.Domain.Enums;

namespace SchoolSystem.Domain.Entities
{
    public class Lesson : BaseEntity
    {
        public string Title { get; set; }                // عنوان الدرس
        public string Description { get; set; }          // وصف الدرس
        public DateTime Date { get; set; }               // تاريخ الدرس
        public DateTime StartTime { get; set; }          // وقت البدء
        public DateTime EndTime { get; set; }            // وقت الانتهاء
        public int Duration { get; set; }                // المدة بالدقائق
        public LessonStatus Status { get; set; }         // حالة الدرس (Completed, Upcoming, Cancelled)
        public LessonType Type { get; set; }             // نوع الدرس

        // العلاقات
        public Guid ClassOid { get; set; }               // الصف
        public Class Class { get; set; }

        public Guid TeacherOid { get; set; }             // المعلم
        public Teacher Teacher { get; set; }

        public Guid SubjectOid { get; set; }             // المادة
        public Subject Subject { get; set; }

        // المواد المرفقة
        public ICollection<LessonMaterial> Materials { get; set; } = new List<LessonMaterial>();

        // الأهداف التعليمية
        public ICollection<LessonObjective> Objectives { get; set; } = new List<LessonObjective>();

        // الواجبات
        public ICollection<LessonHomework> Homeworks { get; set; } = new List<LessonHomework>();
    }

   
}