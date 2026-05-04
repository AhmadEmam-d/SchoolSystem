// Application/Features/Materials/Commands/DeleteMaterialCommandHandler.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Materials.Commands
{
    public class DeleteMaterialCommandHandler : IRequestHandler<DeleteMaterialCommand, bool>
    {
        private readonly IGenericRepository<Material> _materialRepo;

        public DeleteMaterialCommandHandler(IGenericRepository<Material> materialRepo)
        {
            _materialRepo = materialRepo;
        }

        public async Task<bool> Handle(DeleteMaterialCommand request, CancellationToken cancellationToken)
        {
            var material = await _materialRepo
                .GetAllQueryable()
                .FirstOrDefaultAsync(m => m.FileUrl == request.FileUrl, cancellationToken);

            if (material == null)
                return false;

            await _materialRepo.DeleteAsync(material.Oid); // ← DeleteAsync takes Guid, not entity
            return true;
        }
    }
}