using SchoolSystem.Domain.Common;
using System;

namespace SchoolSystem.Domain.Entities
{
    public class Report : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Format { get; set; } = string.Empty;
        public string Data { get; set; } = string.Empty;
        public DateTime GeneratedAt { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Parameters { get; set; } = string.Empty;
        public bool IsArchived { get; set; }
    }

    



}