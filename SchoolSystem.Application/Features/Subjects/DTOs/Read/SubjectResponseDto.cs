using SchoolSystem.Application.Features.Teachers.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Subjects.DTOs
{
    public class SubjectResponseDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; }
        public List<TeacherBasicDto> Teachers { get; set; } = new List<TeacherBasicDto>();
        public class TeacherBasicDto
        {
            public Guid Oid { get; set; }
            public string FullName { get; set; }
            public string Email { get; set; }
        }
    }
}

