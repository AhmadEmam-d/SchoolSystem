using MediatR;
using SchoolSystem.Application.Features.Notifications.DTOs;

namespace SchoolSystem.Application.Features.Notifications.Queries.GetSummary
{
    public class GetNotificationSummaryQuery : IRequest<NotificationSummaryDto>
    {
    }
}