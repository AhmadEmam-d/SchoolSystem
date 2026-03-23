using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Notifications.Dtos.Read;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Notifications.Queries.GetAll
{
    public class GetAllNotificationsQueryHandler : IRequestHandler<GetAllNotificationsQuery, List<NotificationDto>>
    {
        private readonly IGenericRepository<Notification> _notificationRepo;
        private readonly IMapper _mapper;

        public GetAllNotificationsQueryHandler(IGenericRepository<Notification> notificationRepo, IMapper mapper)
        {
            _notificationRepo = notificationRepo;
            _mapper = mapper;
        }

        public async Task<List<NotificationDto>> Handle(GetAllNotificationsQuery request, CancellationToken cancellationToken)
        {
            var query = _notificationRepo.GetAllQueryable();

            if (request.UserOid.HasValue)
            {
                query = query.Where(n => n.UserOid == request.UserOid.Value);
            }

            var notifications = await query
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync(cancellationToken);

            return _mapper.Map<List<NotificationDto>>(notifications);
        }
    }
}