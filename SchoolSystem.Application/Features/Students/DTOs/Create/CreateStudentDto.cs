using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Students.DTOs.Create
{
    public class CreateStudentDto
    {


        public string FullName { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public Guid ClassOid { get; set; }
        public Guid SectionOid { get; set; }
        public Guid ParentOid { get; set; }
    }

}
