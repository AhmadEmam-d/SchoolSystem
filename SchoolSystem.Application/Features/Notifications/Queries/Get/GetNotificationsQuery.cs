using MediatR;
using SchoolSystem.Application.Common;

namespace SchoolSystem.Application.Features.Notifications.Queries.Get
{
    public class GetNotificationsQuery : IRequest<QueryResponse<object>>
    {
        public RequestModel Request { get; set; } = new();
    }
}