using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Reports.Commands.ArchiveReport
{
    public class ArchiveReportCommandHandler : IRequestHandler<ArchiveReportCommand, bool>
    {
        private readonly IGenericRepository<Report> _reportRepo;

        public ArchiveReportCommandHandler(IGenericRepository<Report> reportRepo)
        {
            _reportRepo = reportRepo;
        }

        public async Task<bool> Handle(ArchiveReportCommand request, CancellationToken cancellationToken)
        {
            var report = await _reportRepo.GetByOidAsync(request.Oid);
            if (report == null)
                throw new System.Exception("Report not found");

            report.IsArchived = true;
            await _reportRepo.UpdateAsync(report);
            return true;
        }
    }
}