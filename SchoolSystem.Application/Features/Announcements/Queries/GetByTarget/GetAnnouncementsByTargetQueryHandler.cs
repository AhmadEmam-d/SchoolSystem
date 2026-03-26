using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Announcements.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Announcements.Queries.GetByTarget
{
    public class GetAnnouncementsByTargetQueryHandler : IRequestHandler<GetAnnouncementsByTargetQuery, List<AnnouncementDto>>
    {
        private readonly IGenericRepository<Announcement> _announcementRepo;
        private readonly IMapper _mapper;

        public GetAnnouncementsByTargetQueryHandler(IGenericRepository<Announcement> announcementRepo, IMapper mapper)
        {
            _announcementRepo = announcementRepo;
            _mapper = mapper;
        }

        public async Task<List<AnnouncementDto>> Handle(GetAnnouncementsByTargetQuery request, CancellationToken cancellationToken)
        {
            var announcements = await _announcementRepo.GetAllQueryable()
                .Where(a => a.IsActive && a.IsPublished)
                .Where(a => a.Target == request.Target || a.Target == AnnouncementTarget.All)
                .OrderByDescending(a => a.Priority)
                .ThenByDescending(a => a.PublishDate)
                .ToListAsync(cancellationToken);

            if (request.Take.HasValue)
                announcements = announcements.Take(request.Take.Value).ToList();

            return _mapper.Map<List<AnnouncementDto>>(announcements);
        }
    }
}