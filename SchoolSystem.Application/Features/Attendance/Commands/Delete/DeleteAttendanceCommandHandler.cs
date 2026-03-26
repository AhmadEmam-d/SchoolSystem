using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Attendance.Commands.Delete
{
    public class DeleteAttendanceCommandHandler : IRequestHandler<DeleteAttendanceCommand, bool>
    {
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Attendance> _attendanceRepo;

        public DeleteAttendanceCommandHandler(IGenericRepository<SchoolSystem.Domain.Entities.Attendance> attendanceRepo)
        {
            _attendanceRepo = attendanceRepo;
        }

        public async Task<bool> Handle(DeleteAttendanceCommand request, CancellationToken cancellationToken)
        {
            await _attendanceRepo.DeleteAsync(request.Oid);
            return true;
        }
    }
}