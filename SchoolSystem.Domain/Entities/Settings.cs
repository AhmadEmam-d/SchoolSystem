using SchoolSystem.Domain.Common;
using System;

namespace SchoolSystem.Domain.Entities
{
    public class Setting : BaseEntity
    {
        public string Category { get; set; } = string.Empty;
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string DataType { get; set; } = "string";
        public string? Description { get; set; }
    }

    public class SystemBackup : BaseEntity
    {
        public string BackupName { get; set; } = string.Empty;
        public DateTime BackupTime { get; set; }
        public string BackupPath { get; set; } = string.Empty;
        public long BackupSize { get; set; }
        public string Status { get; set; } = "Pending";
    }

    public class UserPreference : BaseEntity
    {
        public Guid UserId { get; set; }
        public string PreferenceKey { get; set; } = string.Empty;
        public string PreferenceValue { get; set; } = string.Empty;
        public virtual User User { get; set; } = null!;
    }
    public class EmailConfiguration : BaseEntity
    {
        public string SmtpServer { get; set; } = string.Empty;
        public int Port { get; set; } = 587;
        public string SenderEmail { get; set; } = string.Empty;
        public string SenderName { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool UseSsl { get; set; } = true;
        public bool IsActive { get; set; } = true;
    }
    public class AuditLog : BaseEntity
    {
        public string Action { get; set; } = string.Empty;
        public string Entity { get; set; } = string.Empty;
        public string? OldValue { get; set; }
        public string? NewValue { get; set; }
        public string PerformedBy { get; set; } = string.Empty;
        public DateTime PerformedAt { get; set; }
        public string IpAddress { get; set; } = string.Empty;
        public string? UserAgent { get; set; }
    }
}