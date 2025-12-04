using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Classes.DTOs.Update
{
    public class UpdateClassDto
    {
        public string Name { get; set; }
        public string Description { get; set; }

        public Guid? TeacherOid { get; set; }
    }

}
