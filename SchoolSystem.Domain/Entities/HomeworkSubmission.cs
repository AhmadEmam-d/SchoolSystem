// Domain/Entities/HomeworkSubmission.cs
using SchoolSystem.Domain.Common;

namespace SchoolSystem.Domain.Entities
{
    public class HomeworkSubmission : BaseEntity
    {
        public string? Content { get; set; }
        public string? AttachmentUrl { get; set; }
        public DateTime SubmittedAt { get; set; }
        public decimal? Grade { get; set; }
        public string? Feedback { get; set; }
        public DateTime? GradedAt { get; set; }
        public SubmissionStatus Status { get; set; }

        public Guid HomeworkOid { get; set; }
        public Homework Homework { get; set; } = null!;

        public Guid StudentOid { get; set; }
        public Student Student { get; set; } = null!;
    }

    public enum SubmissionStatus
    {
        Pending = 1,
        Submitted = 2,
        Late = 3,
        Graded = 4
    }
}