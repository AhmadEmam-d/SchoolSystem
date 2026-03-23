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
        public ClassBasicDto Class { get; set; }
        public List<StudentBasicDto> Students { get; set; } = new();
    }

    public class ClassBasicDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; }
        public string Level { get; set; }
    }

    public class StudentBasicDto
    {
        public Guid Oid { get; set; }
        public string FullName { get; set; }
    }

}
