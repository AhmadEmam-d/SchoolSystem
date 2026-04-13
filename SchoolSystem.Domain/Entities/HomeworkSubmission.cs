using SchoolSystem.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Domain.Entities
{
    public class HomeworkSubmission : BaseEntity
    {
        public Guid HomeworkId { get; set; }
        public Homework Homework { get; set; } = null!;

        public Guid StudentId { get; set; }
        public Student Student { get; set; } = null!;

        public string? Content { get; set; }
        public DateTime SubmissionDate { get; set; }
        public decimal? Grade { get; set; }
        public string Status { get; set; } = "Submitted";
        public bool IsGraded { get; set; }
    }
}
