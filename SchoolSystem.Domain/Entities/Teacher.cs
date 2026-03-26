using SchoolSystem.Domain.Common;

public class Teacher : BaseEntity
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }

    public ICollection<TeacherSubject> TeacherSubjects { get; set; } = new List<TeacherSubject>();
    public ICollection<SchoolSystem.Domain.Entities.Timetable> Timetables { get; set; } = new List<SchoolSystem.Domain.Entities.Timetable>();
}
