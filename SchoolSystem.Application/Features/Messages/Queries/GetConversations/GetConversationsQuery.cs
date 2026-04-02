using MediatR;
using SchoolSystem.Application.Features.Messages.DTOs;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Messages.Queries.GetConversations
{
    public class GetConversationsQuery : IRequest<List<ConversationDto>>
    {
    }
}