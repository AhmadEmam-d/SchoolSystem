using SchoolSystem.Domain.Common;

public class Subject : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public ICollection<TeacherSubject> TeacherSubjects { get; set; } = new List<TeacherSubject>();

}
