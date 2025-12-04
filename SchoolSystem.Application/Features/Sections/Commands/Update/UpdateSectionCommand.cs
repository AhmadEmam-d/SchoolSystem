using System;
using System.Collections.Generic;
using System.Text;
using MediatR;
using SchoolSystem.Application.Features.Sections.DTOs.Update;
namespace SchoolSystem.Application.Features.Sections.Commands.Update
{
   

    public record UpdateSectionCommand(Guid Id, UpdateSectionDto Section) : IRequest;

}
