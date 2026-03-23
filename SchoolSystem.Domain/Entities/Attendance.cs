using SchoolSystem.Domain.Common;
using SchoolSystem.Domain.Entities;

public class Attendance : BaseEntity
{
    public Guid StudentOid { get; set; }
    public Student Student { get; set; }

    public DateTime Date { get; set; }
    public bool IsPresent { get; set; }
}
