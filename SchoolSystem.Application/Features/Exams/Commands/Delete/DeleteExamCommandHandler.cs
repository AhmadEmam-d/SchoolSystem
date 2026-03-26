using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Exams.Commands.Delete
{
    public class DeleteExamCommandHandler : IRequestHandler<DeleteExamCommand, bool>
    {
        private readonly IGenericRepository<Exam> _examRepo;

        public DeleteExamCommandHandler(IGenericRepository<Exam> examRepo)
        {
            _examRepo = examRepo;
        }

        public async Task<bool> Handle(DeleteExamCommand request, CancellationToken cancellationToken)
        {
            await _examRepo.DeleteAsync(request.Oid);
            return true;
        }
    }
}