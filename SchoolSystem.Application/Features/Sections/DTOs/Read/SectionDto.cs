using SchoolSystem.Application.Features.Classes.DTOs.Read;
using SchoolSystem.Application.Features.Students.DTOs.Read;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Sections.DTOs.Read
{
    public class SectionDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; }
        public ClassResponseDto Class { get; set; }
        public List<StudentDto> Students { get; set; } = new List<StudentDto>();
    }

}
