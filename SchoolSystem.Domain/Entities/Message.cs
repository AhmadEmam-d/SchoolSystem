using SchoolSystem.Domain.Common;

public class Message : BaseEntity
{
    public Guid SenderOid { get; set; }
    public Guid ReceiverOid { get; set; }

    public string Content { get; set; }
    public DateTime SentAt { get; set; }
}
