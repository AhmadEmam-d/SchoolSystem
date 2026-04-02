using MediatR;
using System;

namespace SchoolSystem.Application.Features.Messages.Commands.MarkRead
{
    public class MarkMessageAsReadCommand : IRequest<bool>
    {
        public Guid Oid { get; set; }

        public MarkMessageAsReadCommand(Guid oid)
        {
            Oid = oid;
        }
    }
}