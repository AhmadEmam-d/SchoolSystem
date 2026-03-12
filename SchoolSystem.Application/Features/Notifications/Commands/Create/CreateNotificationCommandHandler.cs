using AutoMapper;
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Notifications.Commands.Create
{
    public class CreateNotificationCommandHandler : IRequestHandler<CreateNotificationCommand, Guid>
    {
        private readonly IGenericRepository<Notification> _notificationRepo;
        private readonly IMapper _mapper;

        public CreateNotificationCommandHandler(IGenericRepository<Notification> notificationRepo, IMapper mapper)
        {
            _notificationRepo = notificationRepo;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(CreateNotificationCommand request, CancellationToken cancellationToken)
        {
            var notification = _mapper.Map<Notification>(request.Dto);

            await _notificationRepo.AddAsync(notification);

            return notification.Oid;
        }
    }
}