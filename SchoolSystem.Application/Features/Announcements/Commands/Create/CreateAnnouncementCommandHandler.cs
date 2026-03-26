using AutoMapper;
using MediatR;
using SchoolSystem.Application.Features.Announcements.DTOs;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Announcements.Commands.Create
{
    public class CreateAnnouncementCommandHandler : IRequestHandler<CreateAnnouncementCommand, Guid>
    {
        private readonly IGenericRepository<Announcement> _announcementRepo;
        private readonly IMapper _mapper;
        private readonly ICurrentUserService _currentUser;

        public CreateAnnouncementCommandHandler(
            IGenericRepository<Announcement> announcementRepo,
            IMapper mapper,
            ICurrentUserService currentUser)
        {
            _announcementRepo = announcementRepo;
            _mapper = mapper;
            _currentUser = currentUser;
        }

        public async Task<Guid> Handle(CreateAnnouncementCommand request, CancellationToken cancellationToken)
        {
            var announcement = new Announcement
            {
                Title = request.Dto.Title,
                ContentAr = request.Dto.ContentAr,
                ContentEn = request.Dto.ContentEn,
                Target = (AnnouncementTarget)Enum.Parse(typeof(AnnouncementTarget), request.Dto.Target),
                Priority = (AnnouncementPriority)Enum.Parse(typeof(AnnouncementPriority), request.Dto.Priority),
                PublishDate = request.Dto.PublishDate ?? DateTime.UtcNow,
                ExpiryDate = request.Dto.ExpiryDate,
                AuthorName = _currentUser?.Name ?? "System Administrator",
                IsPublished = true,
                IsActive = true,
                ViewCount = 0
            };

            await _announcementRepo.AddAsync(announcement);
            return announcement.Oid;
        }
    }
}