using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Exams.Commands.Delete
{
    public class DeleteExamCommandHandler : IRequestHandler<DeleteExamCommand, bool>
    {
        private readonly IGenericRepository<Exam> _examRepo;
        private readonly IGenericRepository<ExamResult> _examResultRepo;
        private readonly IGenericRepository<Material> _materialRepo;

        public DeleteExamCommandHandler(
            IGenericRepository<Exam> examRepo,
            IGenericRepository<ExamResult> examResultRepo,
            IGenericRepository<Material> materialRepo)
        {
            _examRepo = examRepo;
            _examResultRepo = examResultRepo;
            _materialRepo = materialRepo;
        }

        public async Task<bool> Handle(DeleteExamCommand request, CancellationToken cancellationToken)
        {
            var exam = await _examRepo.GetByOidAsync(request.Oid);
            if (exam is null)
                return false;

            var results = await _examResultRepo
                .GetAllQueryable()
                .Where(r => r.ExamOid == request.Oid)
                .ToListAsync(cancellationToken);

            foreach (var result in results)
                await _examResultRepo.DeleteAsync(result.Oid);

            var materials = await _materialRepo
                .GetAllQueryable()
                .Where(m => m.ExamOid == request.Oid)
                .ToListAsync(cancellationToken);

            foreach (var material in materials)
                await _materialRepo.DeleteAsync(material.Oid);

            await _examRepo.DeleteAsync(request.Oid);
            return true;
        }
    }
}