using AutoMapper;
using MediatR;
using SchoolSystem.Application.Features.Messages.DTOs;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Messages.Commands.Send
{
    public class SendMessageCommandHandler : IRequestHandler<SendMessageCommand, Guid>
    {
        private readonly IGenericRepository<Message> _messageRepo;
        private readonly IGenericRepository<User> _userRepo;
        private readonly ICurrentUserService _currentUser;
        private readonly IMapper _mapper;

        public SendMessageCommandHandler(
            IGenericRepository<Message> messageRepo,
            IGenericRepository<User> userRepo,
            ICurrentUserService currentUser,
            IMapper mapper)
        {
            _messageRepo = messageRepo;
            _userRepo = userRepo;
            _currentUser = currentUser;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(SendMessageCommand request, CancellationToken cancellationToken)
        {
            var sender = await _userRepo.GetByOidAsync(_currentUser.UserId.Value);
            if (sender == null)
                throw new Exception("Sender not found");

            string receiverName = null;
            string receiverRole = null;
            Guid? receiverOid = null;

            if (!request.Dto.IsGroupMessage && request.Dto.ReceiverOid.HasValue)
            {
                var receiver = await _userRepo.GetByOidAsync(request.Dto.ReceiverOid.Value);
                if (receiver == null)
                    throw new Exception("Receiver not found");

                receiverName = receiver.FullName;
                receiverRole = receiver.Role.ToString();
                receiverOid = receiver.Oid;
            }

            var message = _mapper.Map<Message>(request.Dto);
            message.SenderOid = sender.Oid;
            message.SenderName = sender.FullName;
            message.SenderRole = sender.Role.ToString();

            // ✅ للرسائل الجماعية، اترك ReceiverName و ReceiverRole فارغين
            if (!request.Dto.IsGroupMessage)
            {
                message.ReceiverOid = receiverOid;
                message.ReceiverName = receiverName;
                message.ReceiverRole = receiverRole;
                message.TargetRole = request.Dto.TargetRole ?? "All";
            }
            else
            {
                message.ReceiverOid = null;
                message.ReceiverName = null;
                message.ReceiverRole = null;
                message.TargetRole = null;
            }

            message.SentAt = DateTime.UtcNow;
            message.IsRead = false;
            message.IsDeletedBySender = false;
            message.IsDeletedByReceiver = false;

            await _messageRepo.AddAsync(message);
            return message.Oid;
        }
    }
}