using SchoolSystem.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Domain.Entities
{
    public class HomeworkSubmission : BaseEntity
    {
        public Guid HomeworkOid { get; set; }
        public Homework Homework { get; set; } = null!;

        public Guid StudentOid { get; set; }
        public Student Student { get; set; } = null!;

        public string? Content { get; set; }
        public DateTime SubmissionDate { get; set; }
        public decimal? Grade { get; set; }
        public string Status { get; set; } = "Submitted";
        public bool IsGraded { get; set; }
        public string? Feedback { get; set; }  // Teacher feedback on submission
        public DateTime? GradedAt { get; set; } // When it was graded

    }
}