using MediatR;
using SchoolSystem.Application.Features.Parents.DTOs.Create;

namespace SchoolSystem.Application.Features.Parents.Commands.Create
{
    

    public record CreateParentCommand(CreateParentDto Parent) : IRequest<Guid>;

}
