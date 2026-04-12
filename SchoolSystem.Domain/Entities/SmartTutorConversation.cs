using SchoolSystem.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Domain.Entities
{
    public class SmartTutorConversation : BaseEntity
    {
        public string ConversationId { get; set; }
        public Guid UserId { get; set; }
        public string UserRole { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
        public string? Attachments { get; set; } // JSON string
        public DateTime Timestamp { get; set; }
        public User User { get; set; }  

    }
}
