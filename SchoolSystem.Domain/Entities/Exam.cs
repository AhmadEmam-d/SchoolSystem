using SchoolSystem.Domain.Common;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;

public class Exam : BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
    public ExamType Type { get; set; }
    public Guid SubjectOid { get; set; }
    public Subject Subject { get; set; }
    public Guid ClassOid { get; set; }
    public Class Class { get; set; }
    public DateTime Date { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan Duration { get; set; }
    public int MaxScore { get; set; }
    public int PassingScore { get; set; }
    public ExamStatus Status { get; set; }
    public string Room { get; set; }
    public string Instructions { get; set; }

    public ICollection<ExamResult> Results { get; set; } = new List<ExamResult>();
}
