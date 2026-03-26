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

namespace SchoolSystem.Application.Features.Announcements.Queries.GetAll
{
    public class GetAnnouncementsQueryHandler : IRequestHandler<GetAnnouncementsQuery, List<AnnouncementDto>>
    {
        private readonly IGenericRepository<Announcement> _announcementRepo;
        private readonly IMapper _mapper;

        public GetAnnouncementsQueryHandler(IGenericRepository<Announcement> announcementRepo, IMapper mapper)
        {
            _announcementRepo = announcementRepo;
            _mapper = mapper;
        }

        public async Task<List<AnnouncementDto>> Handle(GetAnnouncementsQuery request, CancellationToken cancellationToken)
        {
            var query = _announcementRepo.GetAllQueryable()
                .Where(a => a.IsActive && a.IsPublished);

            if (request.Target.HasValue)
                query = query.Where(a => a.Target == request.Target.Value || a.Target == AnnouncementTarget.All);

            if (request.Priority.HasValue)
                query = query.Where(a => a.Priority == request.Priority.Value);

            if (request.FromDate.HasValue)
                query = query.Where(a => a.PublishDate >= request.FromDate.Value);

            if (request.ToDate.HasValue)
                query = query.Where(a => a.PublishDate <= request.ToDate.Value);

            if (!string.IsNullOrEmpty(request.Search))
                query = query.Where(a => a.Title.Contains(request.Search) ||
                                         a.ContentAr.Contains(request.Search) ||
                                         a.ContentEn.Contains(request.Search));

            return await query
                .OrderByDescending(a => a.Priority)
                .ThenByDescending(a => a.PublishDate)
                .ProjectTo<AnnouncementDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        }
    }
}