using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Teachers.DTOs.Update
{

        public class UpdateTeacherDto
        {
            public string FullName { get; set; }= string.Empty;
            public string Email { get; set; }=string.Empty;
            public string Phone { get; set; }= String.Empty;
            public List<Guid> SubjectOids { get; set; } = new List<Guid>();
        }


}
