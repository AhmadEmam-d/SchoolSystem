using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Messages.DTOs
{
    public class MessageDto
    {
        public Guid Oid { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public Guid SenderOid { get; set; }
        public string SenderName { get; set; }= string.Empty;
        public string SenderRole { get; set; } = string.Empty;
        public Guid? ReceiverOid { get; set; }
        public string ReceiverName { get; set; } = string.Empty;
        public string ReceiverRole { get; set; } = string.Empty;
        public bool IsGroupMessage { get; set; }
        public string TargetRole { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
        public DateTime? ReadAt { get; set; }
        public bool IsRead { get; set; }
        public List<MessageDto> Replies { get; set; }= new List<MessageDto>();  
        public string? TimeAgo { get; set; }
    }

    public class CreateMessageDto
    {
        public string Subject { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public Guid? ReceiverOid { get; set; }
        public bool IsGroupMessage { get; set; }
        public string? TargetRole { get; set; }
        public Guid? ParentMessageOid { get; set; }
    }

    public class MessageSummaryDto
    {
        public int TotalMessages { get; set; }
        public int UnreadCount { get; set; }
        public int SentCount { get; set; }
        public int ReceivedCount { get; set; }
        public List<MessageDto> RecentMessages { get; set; }=new List<MessageDto>();
    }

    public class ConversationDto
    {
        public Guid UserOid { get; set; }
        public string UserName { get; set; }=string.Empty;  
        public string UserRole { get; set; } = string.Empty;
        public string LastMessage { get; set; } = string.Empty;
        public DateTime LastMessageTime { get; set; }
        public int UnreadCount { get; set; }
    }
}