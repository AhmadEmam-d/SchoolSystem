using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Teachers.DTOs.Create
{
    namespace SchoolSystem.Application.Features.Teachers.DTOs.Create
    {
        public class CreateTeacherDto
        {
            public string FullName { get; set; }
            public string Email { get; set; }
            public string Phone { get; set; }

            // Optional: subjects assigned later
            public List<Guid>? SubjectOids { get; set; } = new List<Guid>();
        }
    }

}
