using SchoolSystem.Domain.Common;

public class Assignment : BaseEntity
{
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime DueDate { get; set; }

    public Guid SubjectOid { get; set; }
    public Subject Subject { get; set; }
}
