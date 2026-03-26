using MediatR;
using SchoolSystem.Application.Features.Announcements.DTOs;
using System;

namespace SchoolSystem.Application.Features.Announcements.Commands.Create
{
    public class CreateAnnouncementCommand : IRequest<Guid>
    {
        public CreateAnnouncementDto Dto { get; set; }

        public CreateAnnouncementCommand(CreateAnnouncementDto dto)
        {
            Dto = dto;
        }
    }
}