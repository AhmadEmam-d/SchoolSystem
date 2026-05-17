using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Notifications.DTOs
{
    public class NotificationDto
    {
        public Guid Oid { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; }= string.Empty;
        public string Type { get; set; }=string.Empty;
        public string Priority { get; set; }= string.Empty;
        public Guid? UserOid { get; set; }
        public string TargetRole { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime? ReadAt { get; set; }
        public DateTime SentAt { get; set; }
        public string ActionUrl { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public string TimeAgo { get; set; } = string.Empty;
    }

    public class CreateNotificationDto
    {
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; }= string.Empty;
        public string Type { get; set; }=string.Empty;
        public string Priority { get; set; }= string.Empty;
        public Guid? UserOid { get; set; }
        public string TargetRole { get; set; } = string.Empty;
        public string ActionUrl { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public DateTime? ExpiryDate { get; set; }
    }

    public class NotificationSummaryDto
    {
        public int TotalCount { get; set; }
        public int UnreadCount { get; set; }
        public int ReadCount { get; set; }
        public List<NotificationDto> RecentNotifications { get; set; }= new List<NotificationDto>();
    }
}