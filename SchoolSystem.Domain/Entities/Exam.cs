using SchoolSystem.Domain.Common;

public class Exam : BaseEntity
{
    public string ExamName { get; set; }
    public DateTime Date { get; set; }

    public ICollection<ExamResult> Results { get; set; }
}
