using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Parents.DTOs.Update
{
    public class UpdateParentDto
    {
        public string FatherName { get; set; } = string.Empty;
        public string MotherName { get; set; } = string.Empty;
        public string Phone { get; set; }= string.Empty;
        public string Email { get; set; }=string.Empty;
    }
}
