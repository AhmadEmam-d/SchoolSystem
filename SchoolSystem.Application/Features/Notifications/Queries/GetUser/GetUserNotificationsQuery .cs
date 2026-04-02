using MediatR;
using SchoolSystem.Application.Features.Notifications.DTOs;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Notifications.Queries.GetUser
{
    public class GetUserNotificationsQuery : IRequest<List<NotificationDto>>
    {
        public bool? IsRead { get; set; }
        public string? Type { get; set; }
        public int? Take { get; set; }
    }
}