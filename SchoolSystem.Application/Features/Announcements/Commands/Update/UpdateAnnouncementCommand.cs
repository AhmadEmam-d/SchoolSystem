using MediatR;
using SchoolSystem.Application.Features.Announcements.DTOs;
using System;

namespace SchoolSystem.Application.Features.Announcements.Commands.Update
{
    public class UpdateAnnouncementCommand : IRequest<bool>
    {
        public UpdateAnnouncementDto Dto { get; set; }

        public UpdateAnnouncementCommand(UpdateAnnouncementDto dto)
        {
            Dto = dto;
        }
    }
}