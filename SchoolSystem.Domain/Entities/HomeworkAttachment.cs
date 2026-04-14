using SchoolSystem.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Domain.Entities
{
    public class HomeworkAttachment : BaseEntity
    {
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty; // pdf, docx, etc.

        public Guid HomeworkOid { get; set; }
        public Homework Homework { get; set; } = null!;
    }
}
