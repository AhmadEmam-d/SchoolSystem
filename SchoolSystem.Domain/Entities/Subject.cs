using SchoolSystem.Domain.Common;
using SchoolSystem.Domain.Entities;

public class Subject : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public Guid? SchoolId { get; set; }
    public School? School { get; set; }
    public ICollection<TeacherSubject> TeacherSubjects { get; set; } = new List<TeacherSubject>();

}
