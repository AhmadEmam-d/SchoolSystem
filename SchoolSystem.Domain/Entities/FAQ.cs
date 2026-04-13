// Domain/Entities/FAQ.cs
using SchoolSystem.Domain.Common;

namespace SchoolSystem.Domain.Entities
{
    public class FAQ : BaseEntity
    {
        public string Question { get; set; }
        public string Answer { get; set; }
        public string Category { get; set; }
        public int Order { get; set; }
        public bool IsPublished { get; set; }
    }
}