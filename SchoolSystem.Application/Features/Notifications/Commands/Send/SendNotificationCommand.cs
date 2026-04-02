using MediatR;
using SchoolSystem.Application.Features.Notifications.DTOs;
using System;

namespace SchoolSystem.Application.Features.Notifications.Commands.Send
{
    public class SendNotificationCommand : IRequest<Guid>
    {
        public CreateNotificationDto Dto { get; set; }

        public SendNotificationCommand(CreateNotificationDto dto)
        {
            Dto = dto;
        }
    }
}