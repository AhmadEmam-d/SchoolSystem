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
        public string Name { get; set; } = string.Empty;
        public ClassBasicDto Class { get; set; } = new ClassBasicDto();
        public List<StudentBasicDto> Students { get; set; } = new();
    }

    public class ClassBasicDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; }= string.Empty;
        public string Level { get; set; }=string.Empty;
    }

    public class StudentBasicDto
    {
        public Guid Oid { get; set; }
        public string FullName { get; set; }= string.Empty;
        public string Email { get; set; }=string.Empty;
        public string Phone { get; set; }=String.Empty;
        public string ClassName { get; set; } = string.Empty;
        public double AttendancePercentage { get; set; }
        public double AverageGrade { get; set; }
    }

}
