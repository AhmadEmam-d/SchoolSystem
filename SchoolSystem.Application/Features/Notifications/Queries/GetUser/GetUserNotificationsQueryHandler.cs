using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Notifications.DTOs;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Notifications.Queries.GetUser
{
    public class GetUserNotificationsQueryHandler : IRequestHandler<GetUserNotificationsQuery, List<NotificationDto>>
    {
        private readonly IGenericRepository<Notification> _notificationRepo;
        private readonly ICurrentUserService _currentUser;
        private readonly IMapper _mapper;

        public GetUserNotificationsQueryHandler(
            IGenericRepository<Notification> notificationRepo,
            ICurrentUserService currentUser,
            IMapper mapper)
        {
            _notificationRepo = notificationRepo;
            _currentUser = currentUser;
            _mapper = mapper;
        }

        public async Task<List<NotificationDto>> Handle(GetUserNotificationsQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId;
            var userRole = _currentUser.Role;

            var query = _notificationRepo.GetAllQueryable()
                .Where(n => !n.IsDeleted)
                .Where(n => n.UserOid == userId ||
                           (n.TargetRole == "All") ||
                           (n.TargetRole == userRole) ||
                           (string.IsNullOrEmpty(n.TargetRole)));

            if (request.IsRead.HasValue)
                query = query.Where(n => n.IsRead == request.IsRead.Value);

            if (!string.IsNullOrEmpty(request.Type))
                query = query.Where(n => n.Type == request.Type);

            var notifications = await query
                .OrderByDescending(n => n.Priority == "Urgent")
                .ThenByDescending(n => n.SentAt)
                .ProjectTo<NotificationDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);

            if (request.Take.HasValue)
                notifications = notifications.Take(request.Take.Value).ToList();

            return notifications;
        }
    }
}