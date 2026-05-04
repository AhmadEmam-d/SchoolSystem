// Application/Features/Materials/Commands/DeleteEntityMaterialsCommandHandler.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Materials.Commands
{
    public class DeleteEntityMaterialsCommandHandler : IRequestHandler<DeleteEntityMaterialsCommand, bool>
    {
        private readonly IGenericRepository<Material> _materialRepo;

        public DeleteEntityMaterialsCommandHandler(IGenericRepository<Material> materialRepo)
        {
            _materialRepo = materialRepo;
        }

        public async Task<bool> Handle(DeleteEntityMaterialsCommand request, CancellationToken cancellationToken)
        {
            var materials = await _materialRepo
                .GetAllQueryable()
                .Where(m =>
                    m.EntityType == request.EntityType &&
                    (m.LessonOid == request.EntityId ||
                     m.ExamOid == request.EntityId ||
                     m.HomeworkOid == request.EntityId))
                .ToListAsync(cancellationToken);

            foreach (var material in materials)
                await _materialRepo.DeleteAsync(material.Oid); // ← Guid, not entity

            return true;
        }
    }
}