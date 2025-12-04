using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Subjects.DTOs
{
    public class SubjectResponseDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; }
        public Guid TeacherOid { get; set; }
        public string TeacherName { get; set; }
    }
}

