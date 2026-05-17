// Domain/Entities/FAQ.cs
using SchoolSystem.Domain.Common;

namespace SchoolSystem.Domain.Entities
{
    public class FAQ : BaseEntity
    {
        public string Question { get; set; } = string.Empty;
        public string Answer { get; set; }= string.Empty;
        public string Category { get; set; }=string.Empty;
        public int Order { get; set; }
        public bool IsPublished { get; set; }
    }
}