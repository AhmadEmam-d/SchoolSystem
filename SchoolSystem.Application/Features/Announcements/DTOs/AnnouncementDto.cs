using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Announcements.DTOs
{
    public class AnnouncementDto
    {
        public Guid Oid { get; set; }
        public string Title { get; set; }
        public string ContentAr { get; set; }
        public string ContentEn { get; set; }
        public string Target { get; set; }
        public string Priority { get; set; }
        public DateTime PublishDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string AuthorName { get; set; }
        public bool IsPublished { get; set; }
        public bool IsActive { get; set; }
        public int ViewCount { get; set; }
        public string TimeAgo { get; set; }
    }

    public class CreateAnnouncementDto
    {
        public string Title { get; set; }
        public string ContentAr { get; set; }
        public string ContentEn { get; set; }
        public string Target { get; set; }
        public string Priority { get; set; }
        public DateTime? PublishDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }

    public class UpdateAnnouncementDto
    {
        public Guid Oid { get; set; }
        public string Title { get; set; }
        public string ContentAr { get; set; }
        public string ContentEn { get; set; }
        public string Target { get; set; }
        public string Priority { get; set; }
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
        public List<AnnouncementDto> RecentAnnouncements { get; set; }
    }
}