using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Subjects.DTOs.Create
{
    public class CreateSubjectDto
    {
        public string Name { get; set; }
        public Guid? TeacherOid { get; set; }
    }
}

