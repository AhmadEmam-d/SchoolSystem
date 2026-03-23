using MediatR;
using SchoolSystem.Application.Features.Sections.DTOs;
using SchoolSystem.Application.Features.Sections.DTOs.Create;

namespace SchoolSystem.Application.Features.Sections.Commands.Create
{
    public record CreateSectionCommand(CreateSectionDto Section)
        : IRequest<CreateSectionCommandResponse>;
}