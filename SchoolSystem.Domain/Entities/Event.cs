using SchoolSystem.Domain.Common;

public class Event : BaseEntity
{
    public string Title { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; }
}
