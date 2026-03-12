using System;

namespace SchoolSystem.Domain.Common
{
    public abstract class BaseEntity
    {
        public Guid Oid { get; set; } = Guid.NewGuid();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public bool IsDeleted { get; set; } = false;
    }
}