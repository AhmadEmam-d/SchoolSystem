using SchoolSystem.Domain.Common;
using SchoolSystem.Domain.Entities;

public class Section : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public Guid ClassOid { get; set; }
    public Class? Class { get; set; }

    public ICollection<Student> Students { get; set; } = new List<Student>();
}
