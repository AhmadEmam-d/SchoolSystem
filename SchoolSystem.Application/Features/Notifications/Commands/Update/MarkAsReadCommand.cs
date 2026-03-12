using MediatR;
using System;

namespace SchoolSystem.Application.Features.Notifications.Commands.Update
{
    public class MarkAsReadCommand : IRequest<bool>
    {
        public Guid Oid { get; set; }

        public MarkAsReadCommand(Guid oid)
        {
            Oid = oid;
        }
    }
}