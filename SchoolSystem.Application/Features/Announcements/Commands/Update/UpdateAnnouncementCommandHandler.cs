using AutoMapper;
using MediatR;
using SchoolSystem.Application.Features.Announcements.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Announcements.Commands.Update
{
    public class UpdateAnnouncementCommandHandler : IRequestHandler<UpdateAnnouncementCommand, bool>
    {
        private readonly IGenericRepository<Announcement> _announcementRepo;
        private readonly IMapper _mapper;

        public UpdateAnnouncementCommandHandler(IGenericRepository<Announcement> announcementRepo, IMapper mapper)
        {
            _announcementRepo = announcementRepo;
            _mapper = mapper;
        }

        public async Task<bool> Handle(UpdateAnnouncementCommand request, CancellationToken cancellationToken)
        {
            var announcement = await _announcementRepo.GetByOidAsync(request.Dto.Oid);
            if (announcement == null)
                throw new Exception("Announcement not found");

            if (!string.IsNullOrEmpty(request.Dto.Title))
                announcement.Title = request.Dto.Title;

            if (!string.IsNullOrEmpty(request.Dto.ContentAr))
                announcement.ContentAr = request.Dto.ContentAr;

            if (!string.IsNullOrEmpty(request.Dto.ContentEn))
                announcement.ContentEn = request.Dto.ContentEn;

            if (!string.IsNullOrEmpty(request.Dto.Target))
                announcement.Target = (AnnouncementTarget)Enum.Parse(typeof(AnnouncementTarget), request.Dto.Target);

            if (!string.IsNullOrEmpty(request.Dto.Priority))
                announcement.Priority = (AnnouncementPriority)Enum.Parse(typeof(AnnouncementPriority), request.Dto.Priority);

            if (request.Dto.PublishDate.HasValue)
                announcement.PublishDate = request.Dto.PublishDate.Value;

            if (request.Dto.ExpiryDate.HasValue)
                announcement.ExpiryDate = request.Dto.ExpiryDate.Value;

            if (request.Dto.IsActive.HasValue)
                announcement.IsActive = request.Dto.IsActive.Value;

            await _announcementRepo.UpdateAsync(announcement);
            return true;
        }
    }
}