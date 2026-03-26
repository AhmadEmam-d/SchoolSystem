using MediatR;
using SchoolSystem.Application.Features.Announcements.DTOs;
using System;

namespace SchoolSystem.Application.Features.Announcements.Queries.GetById
{
    public class GetAnnouncementByIdQuery : IRequest<AnnouncementDto>
    {
        public Guid Oid { get; set; }

        public GetAnnouncementByIdQuery(Guid oid)
        {
            Oid = oid;
        }
    }
}