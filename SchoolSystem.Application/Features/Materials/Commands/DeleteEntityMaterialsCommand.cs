// Application/Features/Materials/Commands/DeleteEntityMaterialsCommand.cs
using MediatR;

namespace SchoolSystem.Application.Features.Materials.Commands
{
    public class DeleteEntityMaterialsCommand : IRequest<bool>
    {
        public string EntityType { get; set; }
        public Guid EntityId { get; set; }
    }
}
