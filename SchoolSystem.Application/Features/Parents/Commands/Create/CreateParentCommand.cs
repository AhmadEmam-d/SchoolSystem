using MediatR;
using SchoolSystem.Application.Features.Parents.DTOs.Create;

namespace SchoolSystem.Application.Features.Parents.Commands.Create
{
    public class CreateParentCommand : IRequest<Guid>
    {
        public CreateParentDto Parent { get; set; }

        public CreateParentCommand(CreateParentDto parent)
        {
            Parent = parent;
        }
    }
}