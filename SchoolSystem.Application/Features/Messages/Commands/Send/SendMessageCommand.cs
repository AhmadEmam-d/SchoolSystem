using MediatR;
using SchoolSystem.Application.Features.Messages.DTOs;
using System;

namespace SchoolSystem.Application.Features.Messages.Commands.Send
{
    public class SendMessageCommand : IRequest<Guid>
    {
        public CreateMessageDto Dto { get; set; }

        public SendMessageCommand(CreateMessageDto dto)
        {
            Dto = dto;
        }
    }
}