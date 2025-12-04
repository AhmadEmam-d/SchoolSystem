using MediatR;
using SchoolSystem.Application.Features.Parents.DTOs.Update;
namespace SchoolSystem.Application.Features.Parents.Commands.Update
{
   

    public record UpdateParentCommand(Guid Id, UpdateParentDto Parent) : IRequest;

}
