using MediatR;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Messages.Commands.Delete
{
    public class DeleteMessageCommandHandler : IRequestHandler<DeleteMessageCommand, bool>
    {
        private readonly IGenericRepository<Message> _messageRepo;
        private readonly ICurrentUserService _currentUser;

        public DeleteMessageCommandHandler(IGenericRepository<Message> messageRepo, ICurrentUserService currentUser)
        {
            _messageRepo = messageRepo;
            _currentUser = currentUser;
        }

        public async Task<bool> Handle(DeleteMessageCommand request, CancellationToken cancellationToken)
        {
            var message = await _messageRepo.GetByOidAsync(request.Oid);
            if (message == null)
                throw new Exception("Message not found");

            if (message.SenderOid == _currentUser.UserId)
                message.IsDeletedBySender = true;
            else if (message.ReceiverOid == _currentUser.UserId)
                message.IsDeletedByReceiver = true;
            else
                throw new Exception("You are not authorized to delete this message");

            if (message.IsDeletedBySender && message.IsDeletedByReceiver)
                await _messageRepo.DeleteAsync(request.Oid);
            else
                await _messageRepo.UpdateAsync(message);

            return true;
        }
    }
}