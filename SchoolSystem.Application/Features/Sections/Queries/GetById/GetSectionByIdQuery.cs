using System;
using System.Collections.Generic;
using System.Text;
using MediatR;
using SchoolSystem.Application.Features.Sections.DTOs.Read;

namespace SchoolSystem.Application.Features.Sections.Queries.GetById
{
   

    public record GetSectionByIdQuery(Guid Id) : IRequest<SectionDto>;

}
