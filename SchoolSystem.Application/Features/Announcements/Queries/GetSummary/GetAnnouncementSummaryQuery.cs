using MediatR;
using SchoolSystem.Application.Features.Announcements.DTOs;

namespace SchoolSystem.Application.Features.Announcements.Queries.GetSummary
{
    public class GetAnnouncementSummaryQuery : IRequest<AnnouncementSummaryDto>
    {
    }
}