using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Students.DTOs.Update
{
    public class UpdateStudentDto
    {
        public string AdmissionNumber { get; set; } = string.Empty;
        public string FullName { get; set; }= string.Empty;
        public string Gender { get; set; }= string.Empty;
        public DateTime DateOfBirth { get; set; } = new DateTime();
        public string Address { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public Guid ClassOid { get; set; } = new Guid();
        public Guid SectionOid { get; set; } = new Guid();
        public Guid ParentOid { get; set; }
    }

}
