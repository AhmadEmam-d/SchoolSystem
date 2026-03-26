using MediatR;
using System;

namespace SchoolSystem.Application.Features.Announcements.Commands.Delete
{
    public class DeleteAnnouncementCommand : IRequest<bool>
    {
        public Guid Oid { get; set; }

        public DeleteAnnouncementCommand(Guid oid)
        {
            Oid = oid;
        }
    }
}