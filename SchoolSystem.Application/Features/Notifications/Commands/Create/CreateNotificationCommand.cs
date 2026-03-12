using MediatR;
using SchoolSystem.Application.Features.Notifications.Dtos.Create;
using System;

namespace SchoolSystem.Application.Features.Notifications.Commands.Create
{
    public class CreateNotificationCommand : IRequest<Guid>
    {
        public CreateNotificationDto Dto { get; set; }

        public CreateNotificationCommand(CreateNotificationDto dto)
        {
            Dto = dto;
        }
    }
}