// Application/Features/Settings/DTOs/SettingsDtos.cs
namespace SchoolSystem.Application.Features.Settings.DTOs
{
    public class SettingsDto
    {
        public GeneralSettingsDto General { get; set; } = new();
        public SchoolInfoDto SchoolInfo { get; set; } = new();
        public LanguageSettingsDto Language { get; set; } = new();
        public AppearanceSettingsDto Appearance { get; set; } = new();
        public SystemSettingsDto System { get; set; } = new();
    }

    public class GeneralSettingsDto
    {
        public NotificationSettingsDto Notifications { get; set; } = new();
        public SecuritySettingsDto Security { get; set; } = new();
    }

    public class NotificationSettingsDto
    {
        public bool EmailNotifications { get; set; } = true;
        public bool PushNotifications { get; set; } = true;
        public bool AttendanceReminders { get; set; } = true;
        public bool GradeUpdates { get; set; } = true;
    }

    public class SecuritySettingsDto
    {
        public bool TwoFactorAuthentication { get; set; } = false;
        public int SessionTimeoutMinutes { get; set; } = 30;
    }

    public class SchoolInfoDto
    {
        public string SchoolName { get; set; } = string.Empty;
        public string SchoolAddress { get; set; } = string.Empty;
        public string SchoolPhone { get; set; } = string.Empty;
        public string SchoolEmail { get; set; } = string.Empty;
        public string SchoolLogo { get; set; } = string.Empty;
        public string PrincipalName { get; set; } = string.Empty;
        public string EstablishedYear { get; set; } = string.Empty;
        public string Website { get; set; } = string.Empty;
        public string RegistrationNumber { get; set; } = string.Empty;
        public string DescriptionEn { get; set; } = string.Empty;     // description (English)
        public string DescriptionAr { get; set; } = string.Empty;     // description (العربية)
        public string AddressEn { get; set; } = string.Empty;         // address (English)
        public string AddressAr { get; set; } = string.Empty;         // address (العربية)
    }

    public class LanguageSettingsDto
    {
        public string DefaultLanguage { get; set; } = "en";
        public string DateFormat { get; set; } = "MM/dd/yyyy";
        public string TimeFormat { get; set; } = "HH:mm";
        public string Timezone { get; set; } = "UTC";
        public List<SupportedLanguageDto> SupportedLanguages { get; set; } = new();
    }

    public class SupportedLanguageDto
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public string? FlagIcon { get; set; }
    }

    public class AppearanceSettingsDto
    {
        public string Theme { get; set; } = "Light";
        public string PrimaryColor { get; set; } = "#1976d2";
        public string SecondaryColor { get; set; } = "#dc004e";
        public string BackgroundColor { get; set; } = "#ffffff";
        public string SurfaceColor { get; set; } = "#f5f5f5";
        public bool CompactMode { get; set; } = false;
        public bool RtlMode { get; set; } = false;
    }

    public class SystemSettingsDto
    {
        public BackupSettingsDto Backup { get; set; } = new();
        public EmailServerConfigDto EmailServer { get; set; } = new();
        public CacheSettingsDto Cache { get; set; } = new();
        public LoggingSettingsDto Logging { get; set; } = new();
    }

    public class BackupSettingsDto
    {
        public DateTime? LastBackupTime { get; set; }
        public string BackupFrequency { get; set; } = "Daily";
        public string BackupLocation { get; set; } = string.Empty;
        public bool AutoBackup { get; set; } = true;
        public int RetentionDays { get; set; } = 30;
    }

    public class EmailServerConfigDto
    {
        public string SmtpServer { get; set; } = string.Empty;
        public int Port { get; set; } = 587;
        public string SenderEmail { get; set; } = string.Empty;
        public string SenderName { get; set; } = string.Empty;
        public bool UseSsl { get; set; } = true;
        public bool IsConfigured { get; set; } = false;
    }

    public class CacheSettingsDto
    {
        public bool EnableCache { get; set; } = true;
        public int CacheDurationMinutes { get; set; } = 30;
        public string CacheProvider { get; set; } = "Memory";
    }

    public class LoggingSettingsDto
    {
        public bool EnableLogging { get; set; } = true;
        public string LogLevel { get; set; } = "Information";
        public int RetentionDays { get; set; } = 30;
    }

    public class SystemBackupDto
    {
        public Guid Oid { get; set; }
        public string BackupName { get; set; } = string.Empty;
        public DateTime BackupTime { get; set; }
        public string BackupPath { get; set; } = string.Empty;
        public long BackupSize { get; set; }
        public string Status { get; set; } = string.Empty;
        public string FormattedSize => $"{BackupSize / 1024.0 / 1024.0:F2} MB";
    }

    public class UserPreferenceDto
    {
        public string Key { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
    }
    public class SystemHealthDto
    {
        public bool DatabaseHealthy { get; set; }
        public bool CacheHealthy { get; set; }
        public bool EmailServiceHealthy { get; set; }
        public double CpuUsage { get; set; }
        public double MemoryUsage { get; set; }
        public long DiskFreeSpace { get; set; }
        public DateTime LastBackupDate { get; set; }
        public int ActiveSessions { get; set; }
        public string Version { get; set; } = string.Empty;
        public List<string> Warnings { get; set; } = new();
    }

    public class AuditLogDto
    {
        public Guid Oid { get; set; }
        public string Action { get; set; } = string.Empty;
        public string Entity { get; set; } = string.Empty;
        public string? OldValue { get; set; }
        public string? NewValue { get; set; }
        public string PerformedBy { get; set; } = string.Empty;
        public DateTime PerformedAt { get; set; }
        public string IpAddress { get; set; } = string.Empty;
        public string? UserAgent { get; set; }
    }
    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}