using MediatR;
using SchoolSystem.Application.Features.SmartTutor.DTOs;

namespace SchoolSystem.Application.Features.SmartTutor.Queries.GetConversations
{
    public class GetConversationsQuery : IRequest<List<SmartTutorConversationDto>>
    {
        public Guid UserId { get; set; }
    }
}