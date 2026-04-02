using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Messages.DTOs;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Messages.Queries.GetSentMessages
{
    public class GetSentMessagesQueryHandler : IRequestHandler<GetSentMessagesQuery, List<MessageDto>>
    {
        private readonly IGenericRepository<Message> _messageRepo;
        private readonly ICurrentUserService _currentUser;
        private readonly IMapper _mapper;

        public GetSentMessagesQueryHandler(
            IGenericRepository<Message> messageRepo,
            ICurrentUserService currentUser,
            IMapper mapper)
        {
            _messageRepo = messageRepo;
            _currentUser = currentUser;
            _mapper = mapper;
        }

        public async Task<List<MessageDto>> Handle(GetSentMessagesQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId.Value;

            var query = _messageRepo.GetAllQueryable()
                .Where(m => m.SenderOid == userId && !m.IsDeletedBySender)
                .OrderByDescending(m => m.SentAt);

            return await query
                .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        }
    }
}