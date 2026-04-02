using MediatR;
using System;

namespace SchoolSystem.Application.Features.Messages.Commands.Delete
{
    public class DeleteMessageCommand : IRequest<bool>
    {
        public Guid Oid { get; set; }

        public DeleteMessageCommand(Guid oid)
        {
            Oid = oid;
        }
    }
}