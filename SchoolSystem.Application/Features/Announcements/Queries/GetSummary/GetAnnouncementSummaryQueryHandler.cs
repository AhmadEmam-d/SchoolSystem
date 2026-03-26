using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Announcements.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Announcements.Queries.GetSummary
{
    public class GetAnnouncementSummaryQueryHandler : IRequestHandler<GetAnnouncementSummaryQuery, AnnouncementSummaryDto>
    {
        private readonly IGenericRepository<Announcement> _announcementRepo;
        private readonly IMapper _mapper;

        public GetAnnouncementSummaryQueryHandler(IGenericRepository<Announcement> announcementRepo, IMapper mapper)
        {
            _announcementRepo = announcementRepo;
            _mapper = mapper;
        }

        public async Task<AnnouncementSummaryDto> Handle(GetAnnouncementSummaryQuery request, CancellationToken cancellationToken)
        {
            var allAnnouncements = await _announcementRepo.GetAllQueryable()
                .Where(a => a.IsActive)
                .ToListAsync(cancellationToken);

            var total = allAnnouncements.Count;
            var published = allAnnouncements.Count(a => a.IsPublished);
            var drafts = allAnnouncements.Count(a => !a.IsPublished);
            var urgent = allAnnouncements.Count(a => a.Priority == AnnouncementPriority.Urgent && a.IsPublished);

            var recentAnnouncements = allAnnouncements
                .Where(a => a.IsPublished)
                .OrderByDescending(a => a.PublishDate)
                .Take(5)
                .Select(a => _mapper.Map<AnnouncementDto>(a))
                .ToList();

            return new AnnouncementSummaryDto
            {
                TotalAnnouncements = total,
                PublishedCount = published,
                DraftCount = drafts,
                UrgentCount = urgent,
                RecentAnnouncements = recentAnnouncements
            };
        }
    }
}