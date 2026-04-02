using MediatR;
using System;

namespace SchoolSystem.Application.Features.Notifications.Commands.MarkAllRead
{
    public class MarkAllNotificationsAsReadCommand : IRequest<int>
    {
        public Guid? UserOid { get; set; }
    }
}