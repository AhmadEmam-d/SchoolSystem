using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Announcements.Commands.Delete
{
    public class DeleteAnnouncementCommandHandler : IRequestHandler<DeleteAnnouncementCommand, bool>
    {
        private readonly IGenericRepository<Announcement> _announcementRepo;

        public DeleteAnnouncementCommandHandler(IGenericRepository<Announcement> announcementRepo)
        {
            _announcementRepo = announcementRepo;
        }

        public async Task<bool> Handle(DeleteAnnouncementCommand request, CancellationToken cancellationToken)
        {
            await _announcementRepo.DeleteAsync(request.Oid);
            return true;
        }
    }
}