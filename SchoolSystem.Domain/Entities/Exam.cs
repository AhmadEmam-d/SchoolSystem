using SchoolSystem.Domain.Common;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;

public class Exam : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; }= string.Empty;
    public ExamType Type { get; set; }
    public Guid TeacherOid { get; set; }  
    public Teacher? Teacher { get; set; }
    public Guid SubjectOid { get; set; }
    public Subject? Subject { get; set; }
    public Guid ClassOid { get; set; }
    public Class? Class { get; set; }
    public DateTime Date { get; set; }
    public Guid? SchoolId { get; set; }
    public School? School { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan Duration { get; set; }
    public int MaxScore { get; set; }
    public int PassingScore { get; set; }
    public ExamStatus Status { get; set; }
    public string Room { get; set; } = string.Empty;
    public string Instructions { get; set; } = string.Empty;

    public ICollection<ExamResult> Results { get; set; } = new List<ExamResult>();
    public ICollection<Material> Materials { get; set; } = new List<Material>();
    public ICollection<ExamSubmission> Submissions { get; set; } = new List<ExamSubmission>();

}
