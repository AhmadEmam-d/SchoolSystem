using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Students.DTOs.Create
{
    public class CreateStudentDto
    {


        public string FullName { get; set; }
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public Guid ClassOid { get; set; }
        public Guid SectionOid { get; set; }
        public Guid ParentOid { get; set; }
    }

}
