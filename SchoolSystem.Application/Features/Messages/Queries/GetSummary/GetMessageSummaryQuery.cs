using MediatR;
using SchoolSystem.Application.Features.Messages.DTOs;

namespace SchoolSystem.Application.Features.Messages.Queries.GetSummary
{
    public class GetMessageSummaryQuery : IRequest<MessageSummaryDto>
    {
    }
}