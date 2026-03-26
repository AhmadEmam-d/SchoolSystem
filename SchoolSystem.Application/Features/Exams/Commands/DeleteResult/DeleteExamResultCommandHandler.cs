using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Exams.Commands.DeleteResult
{
    public class DeleteExamResultCommandHandler : IRequestHandler<DeleteExamResultCommand, bool>
    {
        private readonly IGenericRepository<ExamResult> _examResultRepo;

        public DeleteExamResultCommandHandler(IGenericRepository<ExamResult> examResultRepo)
        {
            _examResultRepo = examResultRepo;
        }

        public async Task<bool> Handle(DeleteExamResultCommand request, CancellationToken cancellationToken)
        {
            await _examResultRepo.DeleteAsync(request.Oid);
            return true;
        }
    }
}