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
            // Case 1: Delete by specific material OID
            if (request.MaterialOid.HasValue)
            {
                var material = await _materialRepo.GetByOidAsync(request.MaterialOid.Value);
                if (material != null)
                {
                    await _materialRepo.DeleteAsync(material.Oid);
                    return true;
                }
                return false;
            }

            // Case 2: Delete all materials for an entity
            if (request.DeleteAllForEntity)
            {
                IQueryable<Material> query = null;

                if (request.ExamOid.HasValue)
                {
                    query = _materialRepo.GetAllQueryable().Where(m => m.ExamOid == request.ExamOid.Value);
                }
                else if (request.LessonOid.HasValue)
                {
                    query = _materialRepo.GetAllQueryable().Where(m => m.LessonOid == request.LessonOid.Value);
                }
                else if (request.HomeworkOid.HasValue)
                {
                    query = _materialRepo.GetAllQueryable().Where(m => m.HomeworkOid == request.HomeworkOid.Value);
                }

                if (query != null)
                {
                    var materials = await query.ToListAsync(cancellationToken);
                    foreach (var material in materials)
                    {
                        await _materialRepo.DeleteAsync(material.Oid);
                    }
                    return true;
                }
                return false;
            }

            // Case 3: Delete by entity OID + file URL (for single file deletion)
            if (!string.IsNullOrEmpty(request.FileUrl))
            {
                IQueryable<Material> query = null;

                if (request.ExamOid.HasValue)
                {
                    query = _materialRepo.GetAllQueryable()
                        .Where(m => m.ExamOid == request.ExamOid.Value && m.FileUrl == request.FileUrl);
                }
                else if (request.LessonOid.HasValue)
                {
                    query = _materialRepo.GetAllQueryable()
                        .Where(m => m.LessonOid == request.LessonOid.Value && m.FileUrl == request.FileUrl);
                }
                else if (request.HomeworkOid.HasValue)
                {
                    query = _materialRepo.GetAllQueryable()
                        .Where(m => m.HomeworkOid == request.HomeworkOid.Value && m.FileUrl == request.FileUrl);
                }

                if (query != null)
                {
                    var material = await query.FirstOrDefaultAsync(cancellationToken);
                    if (material != null)
                    {
                        await _materialRepo.DeleteAsync(material.Oid);
                        return true;
                    }
                }
            }

            return false;
        }
    }
}