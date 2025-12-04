using SchoolSystem.Domain.Common;

public class Teacher : BaseEntity
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }

    public ICollection<Subject> Subjects { get; set; } = new List<Subject>();
}
