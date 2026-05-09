// Application/Features/HelpSupport/Commands/CreateTicket/CreateTicketCommandHandler.cs
using AutoMapper;
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.HelpSupport.Commands.CreateTicket
{
    public class CreateTicketCommandHandler : IRequestHandler<CreateTicketCommand, Guid>
    {
        private readonly IGenericRepository<SupportTicket> _ticketRepo;
        private readonly IMapper _mapper;

        public CreateTicketCommandHandler(IGenericRepository<SupportTicket> ticketRepo, IMapper mapper)
        {
            _ticketRepo = ticketRepo;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(CreateTicketCommand request, CancellationToken cancellationToken)
        {
            var ticket = _mapper.Map<SupportTicket>(request.Ticket);

            ticket.UserId = request.UserId;
            ticket.UserRole = request.UserRole;
            ticket.Status = TicketStatus.Open;

            await _ticketRepo.AddAsync(ticket);
            return ticket.Oid;
        }
    }
}