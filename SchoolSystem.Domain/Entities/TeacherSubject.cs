using SchoolSystem.Domain.Common;

public class TeacherSubject : BaseEntity
{
    public Guid TeacherOid { get; set; }
    public Teacher Teacher { get; set; }

    public Guid SubjectOid { get; set; }
    public Subject Subject { get; set; }
}