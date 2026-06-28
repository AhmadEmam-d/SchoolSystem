using SchoolSystem.Application.Features.Parents.DTOs.Read;
using SchoolSystem.Application.Features.Sections.DTOs.Read;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Classes.DTOs.Read
{
    public class ClassResponseDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int StudentsCount { get; set; }     
        public int SectionsCount { get; set; }
        public List<StudentBasicInfoDto> Students { get; set; }=new List<StudentBasicInfoDto>();
        public List<StudentNameDto> Studentsnames { get; set; } = new List<StudentNameDto>();


    }

}
