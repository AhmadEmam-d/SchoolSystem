using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Timetable.Commands.Delete
{
    public class DeleteTimetableCommandHandler : IRequestHandler<DeleteTimetableCommand, bool>
    {
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Timetable> _timetableRepo;

        public DeleteTimetableCommandHandler(IGenericRepository<SchoolSystem.Domain.Entities.Timetable> timetableRepo)
        {
            _timetableRepo = timetableRepo;
        }

        public async Task<bool> Handle(DeleteTimetableCommand request, CancellationToken cancellationToken)
        {
            await _timetableRepo.DeleteAsync(request.Oid);
            return true;
        }
    }
}