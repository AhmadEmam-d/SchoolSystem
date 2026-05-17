using SchoolSystem.Domain.Common;

public class Assignment : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; }= string.Empty;
    public DateTime DueDate { get; set; }

    public Guid SubjectOid { get; set; }
    public Subject? Subject { get; set; }
}
