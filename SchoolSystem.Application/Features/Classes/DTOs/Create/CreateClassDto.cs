using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Classes.DTOs.Create
{
    public class CreateClassDto
    {
        public string Name { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;

    }
    public class AssignTeacherToClassDto
    {
            public Guid ClassId { get; set; }
            public Guid TeacherId { get; set; }
    }

}
