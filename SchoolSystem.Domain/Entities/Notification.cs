using SchoolSystem.Domain.Common;

public class Notification : BaseEntity
{
    public string Title { get; set; }
    public string Message { get; set; }
    public string Type { get; set; } // Info, Success, Warning, Error
    public string Priority { get; set; } // Low, Normal, High, Urgent
    public Guid? UserOid { get; set; }
    public string TargetRole { get; set; } // Admin, Teacher, Student, Parent, All
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime SentAt { get; set; }
    public string ActionUrl { get; set; }
    public string Icon { get; set; }
    public string Color { get; set; }
    public bool IsDeleted { get; set; }
    public DateTime? ExpiryDate { get; set; }
}
