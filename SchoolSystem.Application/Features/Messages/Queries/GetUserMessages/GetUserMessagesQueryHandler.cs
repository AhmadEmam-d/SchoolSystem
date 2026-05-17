using AutoMapper;
using AutoMapper.QueryableExtensions;
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

namespace SchoolSystem.Application.Features.Messages.Queries.GetUserMessages
{
    public class GetUserMessagesQueryHandler : IRequestHandler<GetUserMessagesQuery, List<MessageDto>>
    {
        private readonly IGenericRepository<Message> _messageRepo;
        private readonly ICurrentUserService _currentUser;
        private readonly IMapper _mapper;

        public GetUserMessagesQueryHandler(
            IGenericRepository<Message> messageRepo,
            ICurrentUserService currentUser,
            IMapper mapper)
        {
            _messageRepo = messageRepo;
            _currentUser = currentUser;
            _mapper = mapper;
        }

        public async Task<List<MessageDto>> Handle(GetUserMessagesQuery request, CancellationToken cancellationToken)
        {
            if (!_currentUser.UserId.HasValue)
                throw new Exception("User not authenticated");

            var userId = _currentUser.UserId.Value;

            var query = _messageRepo.GetAllQueryable()
                .Where(m => m.ReceiverOid == userId && !m.IsDeletedByReceiver);

            if (request.IsRead.HasValue)
                query = query.Where(m => m.IsRead == request.IsRead.Value);

            var orderedQuery = query.OrderByDescending(m => m.SentAt);

            return await orderedQuery
                .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        }
    }
}