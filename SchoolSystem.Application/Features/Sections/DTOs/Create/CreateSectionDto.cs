using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Sections.DTOs.Create
{
    public class CreateSectionDto
    {
        public string Name { get; set; }
        public Guid ClassOid { get; set; } 
    }

}
