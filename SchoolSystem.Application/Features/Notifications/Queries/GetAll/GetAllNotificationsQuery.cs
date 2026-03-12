using MediatR;
using SchoolSystem.Application.Features.Notifications.Dtos.Read;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Notifications.Queries.GetAll
{
    public class GetAllNotificationsQuery : IRequest<List<NotificationDto>>
    {
        public Guid? UserOid { get; set; } 
    }
}