using SchoolSystem.Domain.Common;
using SchoolSystem.Domain.Entities;

public class ExamResult : BaseEntity
{
    public Guid ExamOid { get; set; }
    public Exam Exam { get; set; }

    public Guid StudentOid { get; set; }
    public Student Student { get; set; }

    public int Score { get; set; }
    public int? Percentage { get; set; }
    public string Grade { get; set; }
    public string Remarks { get; set; }
    public bool IsPassed { get; set; }
    public DateTime SubmittedAt { get; set; }
    public DateTime? GradedAt { get; set; }
}
