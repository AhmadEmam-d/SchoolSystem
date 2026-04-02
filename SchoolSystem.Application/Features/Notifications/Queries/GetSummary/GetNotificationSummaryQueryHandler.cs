using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Notifications.DTOs;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Notifications.Queries.GetSummary
{
    public class GetNotificationSummaryQueryHandler : IRequestHandler<GetNotificationSummaryQuery, NotificationSummaryDto>
    {
        private readonly IGenericRepository<Notification> _notificationRepo;
        private readonly ICurrentUserService _currentUser;
        private readonly IMapper _mapper;

        public GetNotificationSummaryQueryHandler(
            IGenericRepository<Notification> notificationRepo,
            ICurrentUserService currentUser,
            IMapper mapper)
        {
            _notificationRepo = notificationRepo;
            _currentUser = currentUser;
            _mapper = mapper;
        }

        public async Task<NotificationSummaryDto> Handle(GetNotificationSummaryQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            var userRole = _currentUser.Role;

            var query = _notificationRepo.GetAllQueryable()
                .Where(n => !n.IsDeleted)
                .Where(n => n.UserOid == userId ||
                           (n.TargetRole == "All") ||
                           (n.TargetRole == userRole) ||
                           (string.IsNullOrEmpty(n.TargetRole)));

            var totalCount = await query.CountAsync(cancellationToken);
            var unreadCount = await query.CountAsync(n => !n.IsRead, cancellationToken);
            var readCount = totalCount - unreadCount;

            var recentNotifications = await query
                .OrderByDescending(n => n.SentAt)
                .Take(10)
                .Select(n => _mapper.Map<NotificationDto>(n))
                .ToListAsync(cancellationToken);

            return new NotificationSummaryDto
            {
                TotalCount = totalCount,
                UnreadCount = unreadCount,
                ReadCount = readCount,
                RecentNotifications = recentNotifications
            };
        }
    }
}