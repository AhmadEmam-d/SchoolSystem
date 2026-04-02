using AutoMapper;
using MediatR;
using SchoolSystem.Application.Features.Notifications.DTOs;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Notifications.Commands.Send
{
    public class SendNotificationCommandHandler : IRequestHandler<SendNotificationCommand, Guid>
    {
        private readonly IGenericRepository<Notification> _notificationRepo;
        private readonly ICurrentUserService _currentUser;
        private readonly IMapper _mapper;

        public SendNotificationCommandHandler(
            IGenericRepository<Notification> notificationRepo,
            ICurrentUserService currentUser,
            IMapper mapper)
        {
            _notificationRepo = notificationRepo;
            _currentUser = currentUser;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(SendNotificationCommand request, CancellationToken cancellationToken)
        {
            var notification = _mapper.Map<Notification>(request.Dto);
            notification.SentAt = DateTime.UtcNow;
            notification.IsRead = false;
            notification.IsDeleted = false;

            await _notificationRepo.AddAsync(notification);
            return notification.Oid;
        }
    }
}