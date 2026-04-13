// Application/Features/HelpSupport/Commands/CreateTicket/CreateTicketCommand.cs
using MediatR;
using SchoolSystem.Application.Features.HelpSupport.DTOs;

namespace SchoolSystem.Application.Features.HelpSupport.Commands.CreateTicket
{
    public class CreateTicketCommand : IRequest<Guid>
    {
        public CreateTicketDto Ticket { get; set; }
        public Guid UserId { get; set; }
        public string UserRole { get; set; }
    }
}