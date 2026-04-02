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

namespace SchoolSystem.Application.Features.Messages.Queries.GetSummary
{
    public class GetMessageSummaryQueryHandler : IRequestHandler<GetMessageSummaryQuery, MessageSummaryDto>
    {
        private readonly IGenericRepository<Message> _messageRepo;
        private readonly ICurrentUserService _currentUser;
        private readonly IMapper _mapper;

        public GetMessageSummaryQueryHandler(
            IGenericRepository<Message> messageRepo,
            ICurrentUserService currentUser,
            IMapper mapper)
        {
            _messageRepo = messageRepo;
            _currentUser = currentUser;
            _mapper = mapper;
        }

        public async Task<MessageSummaryDto> Handle(GetMessageSummaryQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId.Value;

            var allMessages = await _messageRepo.GetAllQueryable()
                .Where(m => (m.SenderOid == userId || m.ReceiverOid == userId) &&
                            !m.IsDeletedBySender && !m.IsDeletedByReceiver)
                .ToListAsync(cancellationToken);

            var totalMessages = allMessages.Count;
            var unreadCount = allMessages.Count(m => m.ReceiverOid == userId && !m.IsRead);
            var sentCount = allMessages.Count(m => m.SenderOid == userId);
            var receivedCount = allMessages.Count(m => m.ReceiverOid == userId);

            var recentMessages = allMessages
                .OrderByDescending(m => m.SentAt)
                .Take(5)
                .Select(m => _mapper.Map<MessageDto>(m))
                .ToList();

            return new MessageSummaryDto
            {
                TotalMessages = totalMessages,
                UnreadCount = unreadCount,
                SentCount = sentCount,
                ReceivedCount = receivedCount,
                RecentMessages = recentMessages
            };
        }
    }
}