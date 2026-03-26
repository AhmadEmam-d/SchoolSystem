using MediatR;
using SchoolSystem.Application.Features.Announcements.DTOs;
using SchoolSystem.Domain.Enums;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Announcements.Queries.GetByTarget
{
    public class GetAnnouncementsByTargetQuery : IRequest<List<AnnouncementDto>>
    {
        public AnnouncementTarget Target { get; set; }
        public int? Take { get; set; }
    }
}