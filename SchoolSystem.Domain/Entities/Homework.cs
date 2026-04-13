using SchoolSystem.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Domain.Entities
{
    public class Homework : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Instructions { get; set; }

        public DateTime DueDate { get; set; }
        public decimal TotalMarks { get; set; }

        public bool AllowLateSubmissions { get; set; }
        public bool NotifyParents { get; set; }
        public string SubmissionType { get; set; } = "File";

        // العلاقات (Foreign Keys)
        public Guid TeacherId { get; set; }
        public Teacher Teacher { get; set; } = null!;

        public Guid ClassId { get; set; }
        public Class Class { get; set; } = null!;

        public Guid SubjectId { get; set; }
        public Subject Subject { get; set; } = null!;

        public ICollection<HomeworkSubmission> Submissions { get; set; } = new List<HomeworkSubmission>();
    }
}
