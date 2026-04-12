using SchoolSystem.Domain.Common;
using System;

namespace SchoolSystem.Domain.Entities
{
    public class Report : BaseEntity
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string Format { get; set; }
        public string Data { get; set; } 
        public DateTime GeneratedAt { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Parameters { get; set; } 
        public bool IsArchived { get; set; }
    }

    



}