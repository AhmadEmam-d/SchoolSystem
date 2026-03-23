using MediatR;
using SchoolSystem.Application.Features.Sections.DTOs;
using SchoolSystem.Application.Features.Sections.DTOs.Update;
using System;

namespace SchoolSystem.Application.Features.Sections.Commands.Update
{
    public record UpdateSectionCommand(Guid Oid, UpdateSectionDto Section)
        : IRequest<UpdateSectionCommandResponse>;
}