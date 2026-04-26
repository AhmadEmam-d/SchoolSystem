// Domain/Entities/ExamSubmission.cs
using SchoolSystem.Domain.Common;

namespace SchoolSystem.Domain.Entities
{
    public class ExamSubmission : BaseEntity
    {
        public Guid ExamOid { get; set; }
        public Exam Exam { get; set; }

        public Guid StudentOid { get; set; }
        public Student Student { get; set; }

        public string? AnswerText { get; set; }
        public string? AttachmentUrl { get; set; }
        public string? FileName { get; set; }

        public DateTime SubmittedAt { get; set; }

        // Grading (filled by teacher)
        public int? Score { get; set; }
        public string? Feedback { get; set; }
        public DateTime? GradedAt { get; set; }
        public Guid? GradedByOid { get; set; }

        public ExamSubmissionStatus Status { get; set; } = ExamSubmissionStatus.Submitted;
    }

    public enum ExamSubmissionStatus
    {
        Submitted,
        Late,
        Graded
    }
}