// Application/Features/HelpSupport/Queries/GetMyTickets/GetMyTicketsQueryHandler.cs
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.HelpSupport.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.HelpSupport.Queries.GetMyTickets
{
    public class GetMyTicketsQueryHandler : IRequestHandler<GetMyTicketsQuery, List<TicketResponseDto>>
    {
        private readonly IGenericRepository<SupportTicket> _ticketRepo;
        private readonly IMapper _mapper;

        public GetMyTicketsQueryHandler(IGenericRepository<SupportTicket> ticketRepo, IMapper mapper)
        {
            _ticketRepo = ticketRepo;
            _mapper = mapper;
        }

        public async Task<List<TicketResponseDto>> Handle(GetMyTicketsQuery request, CancellationToken cancellationToken)
        {
            var tickets = await _ticketRepo
                .GetAllQueryable()
                .Where(t => t.UserId == request.UserId && !t.IsDeleted)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync(cancellationToken);

            return _mapper.Map<List<TicketResponseDto>>(tickets);
        }
    }
}