using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Homeworks.DTOs.Respones
{
    public class HomeworkResponseDto
    {
        public Guid Oid { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
    }
}
