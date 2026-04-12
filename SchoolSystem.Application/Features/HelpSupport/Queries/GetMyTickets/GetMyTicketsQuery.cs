// Application/Features/HelpSupport/Queries/GetMyTickets/GetMyTicketsQuery.cs
using MediatR;
using SchoolSystem.Application.Features.HelpSupport.DTOs;

namespace SchoolSystem.Application.Features.HelpSupport.Queries.GetMyTickets
{
    public class GetMyTicketsQuery : IRequest<List<TicketResponseDto>>
    {
        public Guid UserId { get; set; }

        public GetMyTicketsQuery(Guid userId)
        {
            UserId = userId;
        }
    }
}