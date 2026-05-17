using SchoolSystem.Domain.Common;

public class Notification : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public Guid? UserOid { get; set; }
    public string TargetRole { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
    public DateTime SentAt { get; set; }
    public string ActionUrl { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public DateTime? ExpiryDate { get; set; }
}
