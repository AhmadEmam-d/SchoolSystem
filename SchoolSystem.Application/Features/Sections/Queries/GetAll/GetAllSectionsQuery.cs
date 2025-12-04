using System;
using System.Collections.Generic;
using System.Text;
using MediatR;
using SchoolSystem.Application.Features.Sections.DTOs.Read;
using System.Collections.Generic;


namespace SchoolSystem.Application.Features.Sections.Queries.GetAll
{
   
    public record GetAllSectionsQuery() : IRequest<IEnumerable<SectionDto>>;

}
