// Application/Features/Materials/Commands/DeleteMaterialCommand.cs
using MediatR;

namespace SchoolSystem.Application.Features.Materials.Commands
{
    public class DeleteMaterialCommand : IRequest<bool>
    {
        public string FileUrl { get; set; }
    }
}