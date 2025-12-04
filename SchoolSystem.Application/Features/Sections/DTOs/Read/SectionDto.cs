using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Sections.DTOs.Read
{
    public class SectionDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; }
        public Guid ClassOid { get; set; }
    }

}
