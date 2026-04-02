using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Messages.DTOs
{
    public class MessageDto
    {
        public Guid Oid { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public Guid SenderOid { get; set; }
        public string SenderName { get; set; }
        public string SenderRole { get; set; }
        public Guid? ReceiverOid { get; set; }
        public string ReceiverName { get; set; }
        public string ReceiverRole { get; set; }
        public bool IsGroupMessage { get; set; }
        public string TargetRole { get; set; }
        public DateTime SentAt { get; set; }
        public DateTime? ReadAt { get; set; }
        public bool IsRead { get; set; }
        public List<MessageDto> Replies { get; set; }
        public string TimeAgo { get; set; }
    }

    public class CreateMessageDto
    {
        public string Subject { get; set; }
        public string Content { get; set; }
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
        public List<MessageDto> RecentMessages { get; set; }
    }

    public class ConversationDto
    {
        public Guid UserOid { get; set; }
        public string UserName { get; set; }
        public string UserRole { get; set; }
        public string LastMessage { get; set; }
        public DateTime LastMessageTime { get; set; }
        public int UnreadCount { get; set; }
    }
}