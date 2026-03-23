using MediatR;
using SchoolSystem.Application.Features.Subjects.DTOs;
using SchoolSystem.Application.Features.Subjects.DTOs.Create;

namespace SchoolSystem.Application.Features.Subjects.Commands.Create
{
    public record CreateSubjectCommand(CreateSubjectDto Subject) : IRequest<CreateSubjectCommandResponse>;
}