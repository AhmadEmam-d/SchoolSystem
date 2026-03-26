using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Announcements.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Announcements.Queries.GetById
{
    public class GetAnnouncementByIdQueryHandler : IRequestHandler<GetAnnouncementByIdQuery, AnnouncementDto>
    {
        private readonly IGenericRepository<Announcement> _announcementRepo;
        private readonly IMapper _mapper;

        public GetAnnouncementByIdQueryHandler(IGenericRepository<Announcement> announcementRepo, IMapper mapper)
        {
            _announcementRepo = announcementRepo;
            _mapper = mapper;
        }

        public async Task<AnnouncementDto> Handle(GetAnnouncementByIdQuery request, CancellationToken cancellationToken)
        {
            var announcement = await _announcementRepo.GetAllQueryable()
                .Where(a => a.Oid == request.Oid)
                .ProjectTo<AnnouncementDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(cancellationToken);

            if (announcement != null)
            {
                var entity = await _announcementRepo.GetByOidAsync(request.Oid);
                if (entity != null)
                {
                    entity.ViewCount++;
                    await _announcementRepo.UpdateAsync(entity);
                }
            }

            return announcement;
        }
    }
}