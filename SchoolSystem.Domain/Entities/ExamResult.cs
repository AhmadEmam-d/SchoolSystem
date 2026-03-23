using SchoolSystem.Domain.Common;
using SchoolSystem.Domain.Entities;

public class ExamResult : BaseEntity
{
    public Guid ExamOid { get; set; }
    public Exam Exam { get; set; }

    public Guid StudentOid { get; set; }
    public Student Student { get; set; }

    public Guid SubjectOid { get; set; }
    public Subject Subject { get; set; }

    public double Marks { get; set; }
}
