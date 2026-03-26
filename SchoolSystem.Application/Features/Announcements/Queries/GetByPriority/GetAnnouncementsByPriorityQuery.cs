using MediatR;
using SchoolSystem.Application.Features.Announcements.DTOs;
using SchoolSystem.Domain.Enums;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Announcements.Queries.GetByPriority
{
    public class GetAnnouncementsByPriorityQuery : IRequest<List<AnnouncementDto>>
    {
        public AnnouncementPriority Priority { get; set; }
        public int? Take { get; set; }
    }
}