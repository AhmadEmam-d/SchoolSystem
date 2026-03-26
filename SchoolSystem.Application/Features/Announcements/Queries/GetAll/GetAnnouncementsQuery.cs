using MediatR;
using SchoolSystem.Application.Features.Announcements.DTOs;
using SchoolSystem.Domain.Enums;
using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Announcements.Queries.GetAll
{
    public class GetAnnouncementsQuery : IRequest<List<AnnouncementDto>>
    {
        public AnnouncementTarget? Target { get; set; }
        public AnnouncementPriority? Priority { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string? Search { get; set; }
    }
}