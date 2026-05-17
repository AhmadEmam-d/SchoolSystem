using SchoolSystem.Application.Features.Students.DTOs.Read;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Parents.DTOs.Read
{
    public class ParentDto
    {
        public Guid Oid { get; set; }
        public string FatherName { get; set; } = string.Empty;
        public string MotherName { get; set; }=string.Empty;
        public Guid UserId { get; set; }
        public string UserName { get; set; }= string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; }=string.Empty;
        public List<StudentBasicInfoDto> Students { get; set; } = new();
    }

    public class StudentBasicInfoDto
    {
        public Guid Oid { get; set; }
        public string FullName { get; set; } = string.Empty;
    }


}
