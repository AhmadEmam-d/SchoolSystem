using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Notifications.DTOs
{
    public class NotificationDto
    {
        public Guid Oid { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public string Type { get; set; }
        public string Priority { get; set; }
        public Guid? UserOid { get; set; }
        public string TargetRole { get; set; }
        public bool IsRead { get; set; }
        public DateTime? ReadAt { get; set; }
        public DateTime SentAt { get; set; }
        public string ActionUrl { get; set; }
        public string Icon { get; set; }
        public string Color { get; set; }
        public string TimeAgo { get; set; }
    }

    public class CreateNotificationDto
    {
        public string Title { get; set; }
        public string Message { get; set; }
        public string Type { get; set; }
        public string Priority { get; set; }
        public Guid? UserOid { get; set; }
        public string TargetRole { get; set; }
        public string ActionUrl { get; set; }
        public string Icon { get; set; }
        public string Color { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }

    public class NotificationSummaryDto
    {
        public int TotalCount { get; set; }
        public int UnreadCount { get; set; }
        public int ReadCount { get; set; }
        public List<NotificationDto> RecentNotifications { get; set; }
    }
}