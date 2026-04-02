using MediatR;
using SchoolSystem.Application.Features.Messages.DTOs;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Messages.Queries.GetSentMessages
{
    public class GetSentMessagesQuery : IRequest<List<MessageDto>>
    {
    }
}