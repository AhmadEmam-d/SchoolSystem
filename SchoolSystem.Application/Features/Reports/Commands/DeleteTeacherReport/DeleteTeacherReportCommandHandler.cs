using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Reports.Commands.DeleteTeacherReport
{
    public class DeleteTeacherReportCommandHandler : IRequestHandler<DeleteTeacherReportCommand, bool>
    {
        private readonly IGenericRepository<TeacherReport> _teacherReportRepo;

        public DeleteTeacherReportCommandHandler(IGenericRepository<TeacherReport> teacherReportRepo)
        {
            _teacherReportRepo = teacherReportRepo;
        }

        public async Task<bool> Handle(DeleteTeacherReportCommand request, CancellationToken cancellationToken)
        {
            await _teacherReportRepo.DeleteAsync(request.Oid);
            return true;
        }
    }
}