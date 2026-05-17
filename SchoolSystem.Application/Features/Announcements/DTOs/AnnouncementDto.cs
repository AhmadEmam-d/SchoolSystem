using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Announcements.DTOs
{
    public class AnnouncementDto
    {
        public Guid Oid { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ContentAr { get; set; } = string.Empty;
        public string ContentEn { get; set; } = string.Empty;
        public string Target { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public DateTime PublishDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public bool IsPublished { get; set; }
        public bool IsActive { get; set; }
        public int ViewCount { get; set; }
        public string TimeAgo { get; set; } = string.Empty;
    }

    public class CreateAnnouncementDto
    {
        public string Title { get; set; } = string.Empty;
        public string ContentAr { get; set; } = string.Empty;
        public string ContentEn { get; set; } = string.Empty;
        public string Target { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public DateTime? PublishDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }

    public class UpdateAnnouncementDto
    {
        public Guid Oid { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ContentAr { get; set; } = string.Empty;
        public string ContentEn { get; set; } = string.Empty;
        public string Target { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public DateTime? PublishDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public bool? IsActive { get; set; }
    }

    public class AnnouncementSummaryDto
    {
        public int TotalAnnouncements { get; set; }
        public int PublishedCount { get; set; }
        public int DraftCount { get; set; }
        public int UrgentCount { get; set; }
        public List<AnnouncementDto> RecentAnnouncements { get; set; } = new List<AnnouncementDto>();
    }
}