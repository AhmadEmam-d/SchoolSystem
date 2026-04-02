using MediatR;
using System;

namespace SchoolSystem.Application.Features.Notifications.Commands.MarkRead
{
    public class MarkNotificationAsReadCommand : IRequest<bool>
    {
        public Guid Oid { get; set; }

        public MarkNotificationAsReadCommand(Guid oid)
        {
            Oid = oid;
        }
    }
}