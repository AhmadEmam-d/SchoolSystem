// Domain/Entities/Homework.cs
using SchoolSystem.Domain.Common;
using SchoolSystem.Domain.Enums;

namespace SchoolSystem.Domain.Entities
{
    public class Homework : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Instructions { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime AssignedDate { get; set; }
        public decimal TotalMarks { get; set; }
        public string SubmissionType { get; set; } = "File";
        public bool AllowLateSubmissions { get; set; }
        public bool NotifyParents { get; set; }
        public HomeworkStatus Status { get; set; } = HomeworkStatus.Active;

        public Guid TeacherOid { get; set; }
        public Teacher Teacher { get; set; } = null!;

        public Guid ClassOid { get; set; }
        public Class Class { get; set; } = null!;

        public Guid SubjectOid { get; set; }
        public Subject Subject { get; set; } = null!;

        public ICollection<HomeworkAttachment> Attachments { get; set; } = new List<HomeworkAttachment>();
        public ICollection<HomeworkSubmission> Submissions { get; set; } = new List<HomeworkSubmission>();
    }
}