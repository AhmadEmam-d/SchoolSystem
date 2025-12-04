using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Classes.DTOs.Read
{
    public class ClassResponseDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid? TeacherOid { get; set; }
    }

}
