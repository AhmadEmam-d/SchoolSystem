using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Teachers.DTOs.Create
{

        public class CreateTeacherDto
        {
            public string FullName { get; set; } = string.Empty;
            public string Email { get; set; }= string.Empty;
            public string Phone { get; set; }=string.Empty;
            public List<Guid> SubjectOids { get; set; } = new List<Guid>();
        }
    

}
