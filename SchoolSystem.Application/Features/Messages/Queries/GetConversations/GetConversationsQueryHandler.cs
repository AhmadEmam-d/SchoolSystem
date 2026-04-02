using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Messages.DTOs;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Messages.Queries.GetConversations
{
    public class GetConversationsQueryHandler : IRequestHandler<GetConversationsQuery, List<ConversationDto>>
    {
        private readonly IGenericRepository<Message> _messageRepo;
        private readonly ICurrentUserService _currentUser;
        private readonly IMapper _mapper;

        public GetConversationsQueryHandler(
            IGenericRepository<Message> messageRepo,
            ICurrentUserService currentUser,
            IMapper mapper)
        {
            _messageRepo = messageRepo;
            _currentUser = currentUser;
            _mapper = mapper;
        }

        public async Task<List<ConversationDto>> Handle(GetConversationsQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId.Value;

            var messages = await _messageRepo.GetAllQueryable()
                .Where(m => (m.SenderOid == userId || m.ReceiverOid == userId) &&
                            !m.IsDeletedBySender && !m.IsDeletedByReceiver)
                .OrderByDescending(m => m.SentAt)
                .ToListAsync(cancellationToken);

            var conversations = messages
                .GroupBy(m => m.SenderOid == userId ? m.ReceiverOid : m.SenderOid)
                .Select(g => new
                {
                    UserOid = g.Key ?? Guid.Empty,
                    LastMessage = g.OrderByDescending(m => m.SentAt).FirstOrDefault(),
                    UnreadCount = g.Count(m => m.ReceiverOid == userId && !m.IsRead)
                })
                .ToList();

            var result = new List<ConversationDto>();
            foreach (var conv in conversations)
            {
                if (conv.LastMessage == null) continue;

                var lastMessage = conv.LastMessage;
                var otherUser = lastMessage.SenderOid == userId ? lastMessage.ReceiverName : lastMessage.SenderName;
                var otherRole = lastMessage.SenderOid == userId ? lastMessage.ReceiverRole : lastMessage.SenderRole;

                result.Add(new ConversationDto
                {
                    UserOid = conv.UserOid,
                    UserName = otherUser ?? "Unknown",
                    UserRole = otherRole ?? "User",
                    LastMessage = lastMessage.Content?.Length > 50 ? lastMessage.Content.Substring(0, 50) + "..." : (lastMessage.Content ?? ""),
                    LastMessageTime = lastMessage.SentAt,
                    UnreadCount = conv.UnreadCount
                });
            }

            return result.OrderByDescending(c => c.LastMessageTime).ToList();
        }
    }
}