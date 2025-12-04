using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Teachers.DTOs.Update
{
    namespace SchoolSystem.Application.Features.Teachers.DTOs.Update
    {
        public class UpdateTeacherDto
        {
            public string FullName { get; set; }
            public string Email { get; set; }
            public string Phone { get; set; }

            public List<Guid> SubjectOids { get; set; } = new();
        }
    }

}
