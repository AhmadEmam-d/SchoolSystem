using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Reports.Commands.DeleteReport
{
    public class DeleteReportCommandHandler : IRequestHandler<DeleteReportCommand, bool>
    {
        private readonly IGenericRepository<Report> _reportRepo;

        public DeleteReportCommandHandler(IGenericRepository<Report> reportRepo)
        {
            _reportRepo = reportRepo;
        }

        public async Task<bool> Handle(DeleteReportCommand request, CancellationToken cancellationToken)
        {
            await _reportRepo.DeleteAsync(request.Oid);
            return true;
        }
    }
}