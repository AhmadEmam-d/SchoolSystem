using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Notifications.Dtos.Read;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Notifications.Queries.GetById
{
    public class GetNotificationByOidQueryHandler : IRequestHandler<GetNotificationByOidQuery, NotificationDto>
    {
        private readonly IGenericRepository<Notification> _notificationRepo;
        private readonly IMapper _mapper;

        public GetNotificationByOidQueryHandler(IGenericRepository<Notification> notificationRepo, IMapper mapper)
        {
            _notificationRepo = notificationRepo;
            _mapper = mapper;
        }

        public async Task<NotificationDto> Handle(GetNotificationByOidQuery request, CancellationToken cancellationToken)
        {
            var notification = await _notificationRepo
                .GetAllQueryable()
                .FirstOrDefaultAsync(n => n.Oid == request.Oid, cancellationToken);

            return _mapper.Map<NotificationDto>(notification);
        }
    }
}