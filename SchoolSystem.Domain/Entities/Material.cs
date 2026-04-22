using SchoolSystem.Domain.Common;

namespace SchoolSystem.Domain.Entities
{
    public class Material : BaseEntity
    {
        public string Name { get; set; }
        public string FileUrl { get; set; }
        public string FileType { get; set; }
        public long FileSize { get; set; }

        // Entity type this material belongs to
        public string EntityType { get; set; }  // "lesson", "exam", "homework"

        // Foreign keys — only one will have a value
        public Guid? LessonOid { get; set; }
        public Lesson Lesson { get; set; }

        public Guid? ExamOid { get; set; }
        public Exam Exam { get; set; }

        public Guid? HomeworkOid { get; set; }
        public Homework Homework { get; set; }
    }
}