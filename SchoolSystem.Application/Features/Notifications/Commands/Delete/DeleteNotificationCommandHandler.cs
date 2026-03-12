using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Notifications.Commands.Delete
{
    public class DeleteNotificationCommandHandler : IRequestHandler<DeleteNotificationCommand, bool>
    {
        private readonly IGenericRepository<Notification> _notificationRepo;

        public DeleteNotificationCommandHandler(IGenericRepository<Notification> notificationRepo)
        {
            _notificationRepo = notificationRepo;
        }

        public async Task<bool> Handle(DeleteNotificationCommand request, CancellationToken cancellationToken)
        {
            await _notificationRepo.DeleteAsync(request.Oid);
            return true;
        }
    }
}