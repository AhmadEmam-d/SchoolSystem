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
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public List<StudentBasicInfoDto> Students { get; set; } = new();
    }

    public class StudentBasicInfoDto
    {
        public Guid Oid { get; set; }
        public string FullName { get; set; }
    }

}
