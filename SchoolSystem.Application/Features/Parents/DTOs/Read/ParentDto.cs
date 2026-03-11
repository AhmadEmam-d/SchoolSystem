using SchoolSystem.Application.Features.Students.DTOs.Read;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Parents.DTOs.Read
{
    public class ParentDto
    {
        public Guid Oid { get; set; }
        public string FatherName { get; set; }
        public string MotherName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public List<StudentDto> Students { get; set; } = new List<StudentDto>();

    }

}
