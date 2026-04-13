using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.SmartTutor.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.SmartTutor.Queries.GetConversations
{
    public class GetConversationsQueryHandler : IRequestHandler<GetConversationsQuery, List<SmartTutorConversationDto>>
    {
        private readonly IGenericRepository<SmartTutorConversation> _conversationRepo;

        public GetConversationsQueryHandler(IGenericRepository<SmartTutorConversation> conversationRepo)
        {
            _conversationRepo = conversationRepo;
        }

        public async Task<List<SmartTutorConversationDto>> Handle(GetConversationsQuery request, CancellationToken cancellationToken)
        {
            var conversations = await _conversationRepo
                .GetAllQueryable()
                .Where(c => c.UserId == request.UserId && !c.IsDeleted)
                .OrderByDescending(c => c.Timestamp)
                .Select(c => new SmartTutorConversationDto
                {
                    ConversationId = c.ConversationId,
                    Question = c.Question,
                    Answer = c.Answer,
                    Timestamp = c.Timestamp
                })
                .ToListAsync(cancellationToken);

            return conversations;
        }
    }
}