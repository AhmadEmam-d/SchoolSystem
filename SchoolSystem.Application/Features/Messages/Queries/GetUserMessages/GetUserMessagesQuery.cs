using MediatR;
using SchoolSystem.Application.Features.Messages.DTOs;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Messages.Queries.GetUserMessages
{
    public class GetUserMessagesQuery : IRequest<List<MessageDto>>
    {
        public bool? IsRead { get; set; }
    }
}