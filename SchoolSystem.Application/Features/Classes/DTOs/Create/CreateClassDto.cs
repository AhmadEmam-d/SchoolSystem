using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Classes.DTOs.Create
{
    public class CreateClassDto
    {
        public string Name { get; set; }
        public string Description { get; set; }

        // Optional for now
        public Guid? TeacherOid { get; set; }
    }

}
