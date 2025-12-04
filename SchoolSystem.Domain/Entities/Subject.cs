using SchoolSystem.Domain.Common;

public class Subject : BaseEntity
{
    public string Name { get; set; }

    public Guid TeacherOid { get; set; }
    public Teacher Teacher { get; set; }
}
