using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Reports.Commands.DeleteFinancialReport
{
    public class DeleteFinancialReportCommandHandler : IRequestHandler<DeleteFinancialReportCommand, bool>
    {
        private readonly IGenericRepository<FinancialReport> _financialReportRepo;

        public DeleteFinancialReportCommandHandler(IGenericRepository<FinancialReport> financialReportRepo)
        {
            _financialReportRepo = financialReportRepo;
        }

        public async Task<bool> Handle(DeleteFinancialReportCommand request, CancellationToken cancellationToken)
        {
            await _financialReportRepo.DeleteAsync(request.Oid);
            return true;
        }
    }
}