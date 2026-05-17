using SchoolSystem.Domain.Common;

namespace SchoolSystem.Domain.Entities
{
    public class Material : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public long FileSize { get; set; }

        public string EntityType { get; set; } = string.Empty; // "lesson", "exam", "homework"

        public Guid? LessonOid { get; set; }
        public Lesson? Lesson { get; set; }

        public Guid? ExamOid { get; set; }
        public Exam? Exam { get; set; }

        public Guid? HomeworkOid { get; set; }
        public Homework? Homework { get; set; }
    }
}