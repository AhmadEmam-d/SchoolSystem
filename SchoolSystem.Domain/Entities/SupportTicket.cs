// Domain/Entities/SupportTicket.cs
using SchoolSystem.Domain.Common;
using SchoolSystem.Domain.Enums;

namespace SchoolSystem.Domain.Entities
{
    public class SupportTicket : BaseEntity
    {
        public string Subject { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public User? User { get; set; }
        public string UserRole { get; set; } = string.Empty;
        public TicketStatus Status { get; set; }
        public string? Response { get; set; }
        public DateTime? RespondedAt { get; set; }
        public Guid? RespondedBy { get; set; }
    }


}