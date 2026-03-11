using MediatR;
using SchoolSystem.Application.Features.Parents.DTOs.Update;
namespace SchoolSystem.Application.Features.Parents.Commands.Update
{


    public record UpdateParentCommand(Guid Oid, UpdateParentDto Parent)
            : IRequest<UpdateParentCommandResponse>;
}
