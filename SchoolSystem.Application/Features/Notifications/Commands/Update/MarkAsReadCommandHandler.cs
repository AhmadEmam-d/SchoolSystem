using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Notifications.Commands.Update
{
    public class MarkAsReadCommandHandler : IRequestHandler<MarkAsReadCommand, bool>
    {
        private readonly IGenericRepository<Notification> _notificationRepo;

        public MarkAsReadCommandHandler(IGenericRepository<Notification> notificationRepo)
        {
            _notificationRepo = notificationRepo;
        }

        public async Task<bool> Handle(MarkAsReadCommand request, CancellationToken cancellationToken)
        {
            var notification = await _notificationRepo.GetByOidAsync(request.Oid);

            if (notification == null)
                throw new System.Exception("Notification not found");

            notification.IsRead = true;
            await _notificationRepo.UpdateAsync(notification);

            return true;
        }
    }
}