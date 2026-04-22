using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Materials.Commands
{
    public class AddMaterialCommandHandler : IRequestHandler<AddMaterialCommand, Guid>
    {
        private readonly IGenericRepository<Material> _materialRepo;

        public AddMaterialCommandHandler(IGenericRepository<Material> materialRepo)
        {
            _materialRepo = materialRepo;
        }

        public async Task<Guid> Handle(AddMaterialCommand request, CancellationToken cancellationToken)
        {
            var material = new Material
            {
                Oid = Guid.NewGuid(),
                Name = request.Name,
                FileUrl = request.FileUrl,
                FileType = request.FileType,
                FileSize = request.FileSize,
                EntityType = request.EntityType,
                LessonOid = request.LessonOid,
                ExamOid = request.ExamOid,
                HomeworkOid = request.HomeworkOid,
                CreatedAt = DateTime.UtcNow
            };

            await _materialRepo.AddAsync(material);
            return material.Oid;
        }
    }
}