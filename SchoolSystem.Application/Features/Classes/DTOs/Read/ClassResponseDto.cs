using SchoolSystem.Application.Features.Sections.DTOs.Read;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Classes.DTOs.Read
{
    public class ClassResponseDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; }
        public string Level { get; set; }
        public DateTime CreatedAt { get; set; }
        public int StudentsCount { get; set; }     
        public int SectionsCount { get; set; }

    }

}
