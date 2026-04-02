using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Notifications.Commands.MarkAllRead
{
    public class MarkAllNotificationsAsReadCommandHandler : IRequestHandler<MarkAllNotificationsAsReadCommand, int>
    {
        private readonly IGenericRepository<Notification> _notificationRepo;
        private readonly ICurrentUserService _currentUser;

        public MarkAllNotificationsAsReadCommandHandler(
            IGenericRepository<Notification> notificationRepo,
            ICurrentUserService currentUser)
        {
            _notificationRepo = notificationRepo;
            _currentUser = currentUser;
        }

        public async Task<int> Handle(MarkAllNotificationsAsReadCommand request, CancellationToken cancellationToken)
        {
            var query = _notificationRepo.GetAllQueryable()
                .Where(n => !n.IsRead && !n.IsDeleted);

            if (request.UserOid.HasValue)
                query = query.Where(n => n.UserOid == request.UserOid.Value);
            else if (_currentUser.UserId.HasValue)
                query = query.Where(n => n.UserOid == _currentUser.UserId.Value || n.TargetRole == "All");

            var notifications = await query.ToListAsync(cancellationToken);
            var count = notifications.Count;

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
                notification.ReadAt = DateTime.UtcNow;
                // ✅ استخدام UpdateAsync لكل عنصر على حدة
                await _notificationRepo.UpdateAsync(notification);
            }

            return count;
        }
    }
}