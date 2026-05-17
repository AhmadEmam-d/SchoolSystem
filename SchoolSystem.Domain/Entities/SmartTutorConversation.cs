using SchoolSystem.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Domain.Entities
{
    public class SmartTutorConversation : BaseEntity
    {
        public string ConversationId { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public string UserRole { get; set; } = string.Empty;
        public string Question { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
        public string? Attachments { get; set; } 
        public DateTime Timestamp { get; set; }
        public User? User { get; set; }  

    }
}
