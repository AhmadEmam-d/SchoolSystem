using SchoolSystem.Domain.Common;
using SchoolSystem.Domain.Enums;
using System;

namespace SchoolSystem.Domain.Entities
{
    public class Announcement : BaseEntity
    {
        public string Title { get; set; }
        public string ContentAr { get; set; }
        public string ContentEn { get; set; }
        public AnnouncementTarget Target { get; set; }
        public AnnouncementPriority Priority { get; set; }
        public DateTime PublishDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public Guid? AuthorOid { get; set; }
        public string AuthorName { get; set; }
        public bool IsPublished { get; set; }
        public bool IsActive { get; set; }
        public int ViewCount { get; set; }
    }

    


}