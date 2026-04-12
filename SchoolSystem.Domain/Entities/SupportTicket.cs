// Domain/Entities/SupportTicket.cs
using SchoolSystem.Domain.Common;
using SchoolSystem.Domain.Enums;

namespace SchoolSystem.Domain.Entities
{
    public class SupportTicket : BaseEntity
    {
        public string Subject { get; set; }
        public string Category { get; set; }
        public string Message { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public string UserRole { get; set; }
        public TicketStatus Status { get; set; }
        public string? Response { get; set; }
        public DateTime? RespondedAt { get; set; }
        public Guid? RespondedBy { get; set; }
    }


}