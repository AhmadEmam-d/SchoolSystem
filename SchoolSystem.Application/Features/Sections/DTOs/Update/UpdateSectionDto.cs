using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Sections.DTOs.Update
{
    public class UpdateSectionDto
    {
        public string Name { get; set; }
        public Guid ClassOid { get; set; }
    }

}
