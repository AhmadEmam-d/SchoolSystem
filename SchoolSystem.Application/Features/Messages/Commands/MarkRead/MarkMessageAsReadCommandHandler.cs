using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Messages.Commands.MarkRead
{
    public class MarkMessageAsReadCommandHandler : IRequestHandler<MarkMessageAsReadCommand, bool>
    {
        private readonly IGenericRepository<Message> _messageRepo;

        public MarkMessageAsReadCommandHandler(IGenericRepository<Message> messageRepo)
        {
            _messageRepo = messageRepo;
        }

        public async Task<bool> Handle(MarkMessageAsReadCommand request, CancellationToken cancellationToken)
        {
            var message = await _messageRepo.GetByOidAsync(request.Oid);
            if (message == null)
                throw new Exception("Message not found");

            if (!message.IsRead)
            {
                message.IsRead = true;
                message.ReadAt = DateTime.UtcNow;
                await _messageRepo.UpdateAsync(message);
            }

            return true;
        }
    }
}