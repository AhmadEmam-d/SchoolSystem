using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Homeworks.DTOs.Create
{
    public class CreateHomeworksDto
    {
          
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Instructions { get; set; }
        public DateTime DueDate { get; set; }
        public decimal TotalMarks { get; set; }
        public string SubmissionType { get; set; } = "File";
        public bool AllowLateSubmissions { get; set; }
        public bool NotifyParents { get; set; }
        public Guid ClassId { get; set; }
        public Guid SubjectId { get; set; }
        public List<string> AttachmentUrls { get; set; } = new List<string>();
    }   
}
