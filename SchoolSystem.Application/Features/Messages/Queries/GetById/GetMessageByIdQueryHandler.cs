using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Messages.DTOs;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Messages.Queries.GetById
{
    public class GetMessageByIdQueryHandler : IRequestHandler<GetMessageByIdQuery, MessageDto>
    {
        private readonly IGenericRepository<Message> _messageRepo;
        private readonly ICurrentUserService _currentUser;
        private readonly IMapper _mapper;

        public GetMessageByIdQueryHandler(
            IGenericRepository<Message> messageRepo,
            ICurrentUserService currentUser,
            IMapper mapper)
        {
            _messageRepo = messageRepo;
            _currentUser = currentUser;
            _mapper = mapper;
        }

        public async Task<MessageDto> Handle(GetMessageByIdQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUser.UserId.Value;

            var query = _messageRepo.GetAllQueryable()
                .Where(m => m.Oid == request.Oid &&
                            (m.SenderOid == userId || m.ReceiverOid == userId));

            var message = await query
                .ProjectTo<MessageDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(cancellationToken);

            if (message == null)
                throw new Exception("Message not found or you don't have access");

            return message;
        }
    }
}