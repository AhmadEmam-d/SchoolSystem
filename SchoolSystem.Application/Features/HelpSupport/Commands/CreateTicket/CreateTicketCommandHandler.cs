// Application/Features/HelpSupport/Commands/CreateTicket/CreateTicketCommandHandler.cs
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.HelpSupport.Commands.CreateTicket
{
    public class CreateTicketCommandHandler : IRequestHandler<CreateTicketCommand, Guid>
    {
        private readonly IGenericRepository<SupportTicket> _ticketRepo;

        public CreateTicketCommandHandler(IGenericRepository<SupportTicket> ticketRepo)
        {
            _ticketRepo = ticketRepo;
        }

        public async Task<Guid> Handle(CreateTicketCommand request, CancellationToken cancellationToken)
        {
            var ticket = new SupportTicket
            {
                Oid = Guid.NewGuid(),
                Subject = request.Ticket.Subject,
                Category = request.Ticket.Category,
                Message = request.Ticket.Message,
                UserId = request.UserId,
                UserRole = request.UserRole,
                Status = TicketStatus.Open,
                CreatedAt = DateTime.UtcNow
            };

            await _ticketRepo.AddAsync(ticket);
            return ticket.Oid;
        }
    }
}