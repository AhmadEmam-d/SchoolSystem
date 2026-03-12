using MediatR;
using System;

namespace SchoolSystem.Application.Features.Notifications.Commands.Delete
{
    public class DeleteNotificationCommand : IRequest<bool>
    {
        public Guid Oid { get; set; }

        public DeleteNotificationCommand(Guid oid)
        {
            Oid = oid;
        }
    }
}