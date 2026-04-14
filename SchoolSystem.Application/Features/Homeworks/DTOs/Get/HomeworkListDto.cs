using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Homeworks.DTOs.Get
{
    public class HomeworkListDto
    {
        public Guid Oid { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public string SubjectName { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public decimal TotalMarks { get; set; }
        public string SubmissionType { get; set; } = string.Empty;
        public int SubmittedCount { get; set; }
        public int TotalStudents { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
