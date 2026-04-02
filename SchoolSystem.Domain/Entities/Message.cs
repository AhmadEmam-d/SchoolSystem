using SchoolSystem.Domain.Common;

public class Message : BaseEntity
{
    public string Subject { get; set; }
    public string Content { get; set; }
    public Guid SenderOid { get; set; }
    public string SenderName { get; set; }
    public string SenderRole { get; set; }
    public Guid? ReceiverOid { get; set; }
    public string? ReceiverName { get; set; }
    public string? ReceiverRole { get; set; }
    public bool IsGroupMessage { get; set; }
    public string? TargetRole { get; set; }
    public DateTime SentAt { get; set; }
    public DateTime? ReadAt { get; set; }
    public bool IsRead { get; set; }
    public bool IsDeletedBySender { get; set; }
    public bool IsDeletedByReceiver { get; set; }
    public Guid? ParentMessageOid { get; set; }
}
