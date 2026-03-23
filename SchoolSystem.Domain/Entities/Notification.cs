using SchoolSystem.Domain.Common;

public class Notification : BaseEntity
{
    public Guid UserOid { get; set; }

    public string Message { get; set; }
    public bool IsRead { get; set; }
}
