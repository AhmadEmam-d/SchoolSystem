using MediatR;
using SchoolSystem.Application.Features.Notifications.Dtos.Read;
using System;

namespace SchoolSystem.Application.Features.Notifications.Queries.GetById
{
    public class GetNotificationByOidQuery : IRequest<NotificationDto>
    {
        public Guid Oid { get; set; }

        public GetNotificationByOidQuery(Guid oid)
        {
            Oid = oid;
        }
    }
}