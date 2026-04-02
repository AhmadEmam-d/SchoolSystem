using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Reports.Commands.DeleteStudentReport
{
    public class DeleteStudentReportCommandHandler : IRequestHandler<DeleteStudentReportCommand, bool>
    {
        private readonly IGenericRepository<StudentReport> _studentReportRepo;

        public DeleteStudentReportCommandHandler(IGenericRepository<StudentReport> studentReportRepo)
        {
            _studentReportRepo = studentReportRepo;
        }

        public async Task<bool> Handle(DeleteStudentReportCommand request, CancellationToken cancellationToken)
        {
            await _studentReportRepo.DeleteAsync(request.Oid);
            return true;
        }
    }
}