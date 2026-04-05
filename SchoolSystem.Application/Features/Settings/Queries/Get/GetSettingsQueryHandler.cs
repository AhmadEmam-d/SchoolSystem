// Application/Features/Settings/Handlers/GetSettingsQueryHandler.cs
using MediatR;
using Microsoft.Extensions.Caching.Memory;
using SchoolSystem.Application.Common;
using SchoolSystem.Application.Features.Settings.DTOs;
using SchoolSystem.Application.Features.Settings.Queries.Get;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Settings.Queries.Get
{
    public class GetSettingsQueryHandler : IRequestHandler<GetSettingsQuery, QueryResponse<SettingsDto>>
    {
        private readonly IGenericRepository<Setting> _repository;
        private readonly IMemoryCache _cache;

        public GetSettingsQueryHandler(IGenericRepository<Setting> repository, IMemoryCache cache)
        {
            _repository = repository;
            _cache = cache;
        }

        public async Task<QueryResponse<SettingsDto>> Handle(GetSettingsQuery request, CancellationToken cancellationToken)
        {
            var cacheKey = "SystemSettings";

            if (_cache.TryGetValue(cacheKey, out SettingsDto? cachedSettings) && cachedSettings != null)
            {
                return new QueryResponse<SettingsDto>
                {
                    Success = true,
                    Data = new List<SettingsDto> { cachedSettings },
                    TotalItems = 1,
                    TotalPages = 1
                };
            }

            var settings = new SettingsDto();
            var allSettings = await _repository.GetAllAsync();

            foreach (var setting in allSettings)
            {
                ApplySetting(settings, setting);
            }

            _cache.Set(cacheKey, settings, TimeSpan.FromMinutes(5));

            return new QueryResponse<SettingsDto>
            {
                Success = true,
                Data = new List<SettingsDto> { settings },
                TotalItems = 1,
                TotalPages = 1
            };
        }

        private void ApplySetting(SettingsDto settings, Setting setting)
        {
            switch (setting.Category)
            {
                case "General":
                    if (setting.Key.StartsWith("Notifications."))
                        ApplyNotificationSetting(settings.General.Notifications, setting.Key.Replace("Notifications.", ""), setting.Value);
                    else if (setting.Key.StartsWith("Security."))
                        ApplySecuritySetting(settings.General.Security, setting.Key.Replace("Security.", ""), setting.Value);
                    break;
                case "SchoolInfo":
                    ApplySchoolInfoSetting(settings.SchoolInfo, setting.Key, setting.Value);
                    break;
                case "Language":
                    ApplyLanguageSetting(settings.Language, setting.Key, setting.Value);
                    break;
                case "Appearance":
                    ApplyAppearanceSetting(settings.Appearance, setting.Key, setting.Value);
                    break;
                case "System":
                    if (setting.Key.StartsWith("Backup."))
                        ApplyBackupSetting(settings.System.Backup, setting.Key.Replace("Backup.", ""), setting.Value);
                    break;
            }
        }

        private void ApplyNotificationSetting(NotificationSettingsDto notifications, string key, string value)
        {
            switch (key)
            {
                case "EmailNotifications":
                    notifications.EmailNotifications = bool.Parse(value);
                    break;
                case "PushNotifications":
                    notifications.PushNotifications = bool.Parse(value);
                    break;
                case "AttendanceReminders":
                    notifications.AttendanceReminders = bool.Parse(value);
                    break;
                case "GradeUpdates":
                    notifications.GradeUpdates = bool.Parse(value);
                    break;
            }
        }

        private void ApplySecuritySetting(SecuritySettingsDto security, string key, string value)
        {
            switch (key)
            {
                case "TwoFactorAuth":
                    security.TwoFactorAuthentication = bool.Parse(value);
                    break;
                case "SessionTimeout":
                    security.SessionTimeoutMinutes = int.Parse(value);
                    break;
            }
        }

        private void ApplySchoolInfoSetting(SchoolInfoDto schoolInfo, string key, string value)
        {
            switch (key)
            {
                case "SchoolName":
                    schoolInfo.SchoolName = value;
                    break;
                case "SchoolAddress":
                    schoolInfo.SchoolAddress = value;
                    break;
                case "SchoolPhone":
                    schoolInfo.SchoolPhone = value;
                    break;
                case "SchoolEmail":
                    schoolInfo.SchoolEmail = value;
                    break;
                case "PrincipalName":
                    schoolInfo.PrincipalName = value;
                    break;
                case "EstablishedYear":
                    schoolInfo.EstablishedYear = value;
                    break;
                case "Website":
                    schoolInfo.Website = value;
                    break;
                // أضف الحالات الجديدة
                case "DescriptionEn":
                    schoolInfo.DescriptionEn = value;
                    break;
                case "DescriptionAr":
                    schoolInfo.DescriptionAr = value;
                    break;
                case "AddressEn":
                    schoolInfo.AddressEn = value;
                    break;
                case "AddressAr":
                    schoolInfo.AddressAr = value;
                    break;
            }
        }

        private void ApplyLanguageSetting(LanguageSettingsDto language, string key, string value)
        {
            switch (key)
            {
                case "DefaultLanguage":
                    language.DefaultLanguage = value;
                    break;
                case "DateFormat":
                    language.DateFormat = value;
                    break;
                case "Timezone":
                    language.Timezone = value;
                    break;
            }
        }

        private void ApplyAppearanceSetting(AppearanceSettingsDto appearance, string key, string value)
        {
            switch (key)
            {
                case "Theme":
                    appearance.Theme = value;
                    break;
                case "CompactMode":
                    appearance.CompactMode = bool.Parse(value);
                    break;
                case "PrimaryColor":
                    appearance.PrimaryColor = value;
                    break;
                case "RtlMode":
                    appearance.RtlMode = bool.Parse(value);
                    break;
            }
        }

        private void ApplyBackupSetting(BackupSettingsDto backup, string key, string value)
        {
            switch (key)
            {
                case "AutoBackup":
                    backup.AutoBackup = bool.Parse(value);
                    break;
                case "Frequency":
                    backup.BackupFrequency = value;
                    break;
                case "RetentionDays":
                    backup.RetentionDays = int.Parse(value);
                    break;
            }
        }
    }

    public class GetNotificationPreferencesQueryHandler : IRequestHandler<GetNotificationPreferencesQuery, QueryResponse<NotificationSettingsDto>>
    {
        private readonly IGenericRepository<Setting> _repository;

        public GetNotificationPreferencesQueryHandler(IGenericRepository<Setting> repository)
        {
            _repository = repository;
        }

        public async Task<QueryResponse<NotificationSettingsDto>> Handle(GetNotificationPreferencesQuery request, CancellationToken cancellationToken)
        {
            var notifications = new NotificationSettingsDto();
            var allSettings = await _repository.GetAllAsync();
            var notificationSettings = allSettings.Where(s => s.Category == "General" && s.Key.StartsWith("Notifications."));

            foreach (var setting in notificationSettings)
            {
                var key = setting.Key.Replace("Notifications.", "");
                switch (key)
                {
                    case "EmailNotifications":
                        notifications.EmailNotifications = bool.Parse(setting.Value);
                        break;
                    case "PushNotifications":
                        notifications.PushNotifications = bool.Parse(setting.Value);
                        break;
                    case "AttendanceReminders":
                        notifications.AttendanceReminders = bool.Parse(setting.Value);
                        break;
                    case "GradeUpdates":
                        notifications.GradeUpdates = bool.Parse(setting.Value);
                        break;
                }
            }

            return new QueryResponse<NotificationSettingsDto>
            {
                Success = true,
                Data = new List<NotificationSettingsDto> { notifications },
                TotalItems = 1,
                TotalPages = 1
            };
        }
    }

    // أضف ده بعد GetNotificationPreferencesQueryHandler

    public class GetGeneralSettingsQueryHandler : IRequestHandler<GetGeneralSettingsQuery, QueryResponse<GeneralSettingsDto>>
    {
        private readonly IGenericRepository<Setting> _repository;

        public GetGeneralSettingsQueryHandler(IGenericRepository<Setting> repository)
        {
            _repository = repository;
        }

        public async Task<QueryResponse<GeneralSettingsDto>> Handle(GetGeneralSettingsQuery request, CancellationToken cancellationToken)
        {
            var general = new GeneralSettingsDto();
            var allSettings = await _repository.GetAllAsync();
            var generalSettings = allSettings.Where(s => s.Category == "General");

            foreach (var setting in generalSettings)
            {
                if (setting.Key.StartsWith("Notifications."))
                {
                    var key = setting.Key.Replace("Notifications.", "");
                    switch (key)
                    {
                        case "EmailNotifications":
                            general.Notifications.EmailNotifications = bool.Parse(setting.Value);
                            break;
                        case "PushNotifications":
                            general.Notifications.PushNotifications = bool.Parse(setting.Value);
                            break;
                        case "AttendanceReminders":
                            general.Notifications.AttendanceReminders = bool.Parse(setting.Value);
                            break;
                        case "GradeUpdates":
                            general.Notifications.GradeUpdates = bool.Parse(setting.Value);
                            break;
                    }
                }
                else if (setting.Key.StartsWith("Security."))
                {
                    var key = setting.Key.Replace("Security.", "");
                    switch (key)
                    {
                        case "TwoFactorAuth":
                            general.Security.TwoFactorAuthentication = bool.Parse(setting.Value);
                            break;
                        case "SessionTimeout":
                            general.Security.SessionTimeoutMinutes = int.Parse(setting.Value);
                            break;
                    }
                }
            }

            return new QueryResponse<GeneralSettingsDto>
            {
                Success = true,
                Data = new List<GeneralSettingsDto> { general },
                TotalItems = 1,
                TotalPages = 1
            };
        }
    }

    public class GetSecuritySettingsQueryHandler : IRequestHandler<GetSecuritySettingsQuery, QueryResponse<SecuritySettingsDto>>
    {
        private readonly IGenericRepository<Setting> _repository;

        public GetSecuritySettingsQueryHandler(IGenericRepository<Setting> repository)
        {
            _repository = repository;
        }

        public async Task<QueryResponse<SecuritySettingsDto>> Handle(GetSecuritySettingsQuery request, CancellationToken cancellationToken)
        {
            var security = new SecuritySettingsDto();
            var allSettings = await _repository.GetAllAsync();
            var securitySettings = allSettings.Where(s => s.Category == "General" && s.Key.StartsWith("Security."));

            foreach (var setting in securitySettings)
            {
                var key = setting.Key.Replace("Security.", "");
                switch (key)
                {
                    case "TwoFactorAuth":
                        security.TwoFactorAuthentication = bool.Parse(setting.Value);
                        break;
                    case "SessionTimeout":
                        security.SessionTimeoutMinutes = int.Parse(setting.Value);
                        break;
                }
            }

            return new QueryResponse<SecuritySettingsDto>
            {
                Success = true,
                Data = new List<SecuritySettingsDto> { security },
                TotalItems = 1,
                TotalPages = 1
            };
        }
    }

    public class GetSchoolInfoQueryHandler : IRequestHandler<GetSchoolInfoQuery, QueryResponse<SchoolInfoDto>>
    {
        private readonly IGenericRepository<Setting> _repository;

        public GetSchoolInfoQueryHandler(IGenericRepository<Setting> repository)
        {
            _repository = repository;
        }

        public async Task<QueryResponse<SchoolInfoDto>> Handle(GetSchoolInfoQuery request, CancellationToken cancellationToken)
        {
            var schoolInfo = new SchoolInfoDto();
            var allSettings = await _repository.GetAllAsync();
            var schoolSettings = allSettings.Where(s => s.Category == "SchoolInfo");

            foreach (var setting in schoolSettings)
            {
                switch (setting.Key)
                {
                    case "SchoolName":
                        schoolInfo.SchoolName = setting.Value;
                        break;
                    case "SchoolAddress":
                        schoolInfo.SchoolAddress = setting.Value;
                        break;
                    case "SchoolPhone":
                        schoolInfo.SchoolPhone = setting.Value;
                        break;
                    case "SchoolEmail":
                        schoolInfo.SchoolEmail = setting.Value;
                        break;
                    case "PrincipalName":
                        schoolInfo.PrincipalName = setting.Value;
                        break;
                    case "EstablishedYear":
                        schoolInfo.EstablishedYear = setting.Value;
                        break;
                }
            }

            return new QueryResponse<SchoolInfoDto>
            {
                Success = true,
                Data = new List<SchoolInfoDto> { schoolInfo },
                TotalItems = 1,
                TotalPages = 1
            };
        }
    }

    public class GetLanguageSettingsQueryHandler : IRequestHandler<GetLanguageSettingsQuery, QueryResponse<LanguageSettingsDto>>
    {
        private readonly IGenericRepository<Setting> _repository;

        public GetLanguageSettingsQueryHandler(IGenericRepository<Setting> repository)
        {
            _repository = repository;
        }

        public async Task<QueryResponse<LanguageSettingsDto>> Handle(GetLanguageSettingsQuery request, CancellationToken cancellationToken)
        {
            var language = new LanguageSettingsDto();
            var allSettings = await _repository.GetAllAsync();
            var languageSettings = allSettings.Where(s => s.Category == "Language");

            foreach (var setting in languageSettings)
            {
                switch (setting.Key)
                {
                    case "DefaultLanguage":
                        language.DefaultLanguage = setting.Value;
                        break;
                    case "DateFormat":
                        language.DateFormat = setting.Value;
                        break;
                    case "Timezone":
                        language.Timezone = setting.Value;
                        break;
                }
            }

            return new QueryResponse<LanguageSettingsDto>
            {
                Success = true,
                Data = new List<LanguageSettingsDto> { language },
                TotalItems = 1,
                TotalPages = 1
            };
        }
    }

    public class GetAppearanceSettingsQueryHandler : IRequestHandler<GetAppearanceSettingsQuery, QueryResponse<AppearanceSettingsDto>>
    {
        private readonly IGenericRepository<Setting> _repository;

        public GetAppearanceSettingsQueryHandler(IGenericRepository<Setting> repository)
        {
            _repository = repository;
        }

        public async Task<QueryResponse<AppearanceSettingsDto>> Handle(GetAppearanceSettingsQuery request, CancellationToken cancellationToken)
        {
            var appearance = new AppearanceSettingsDto();
            var allSettings = await _repository.GetAllAsync();
            var appearanceSettings = allSettings.Where(s => s.Category == "Appearance");

            foreach (var setting in appearanceSettings)
            {
                switch (setting.Key)
                {
                    case "Theme":
                        appearance.Theme = setting.Value;
                        break;
                    case "CompactMode":
                        appearance.CompactMode = bool.Parse(setting.Value);
                        break;
                    case "PrimaryColor":
                        appearance.PrimaryColor = setting.Value;
                        break;
                    case "RtlMode":
                        appearance.RtlMode = bool.Parse(setting.Value);
                        break;
                }
            }

            return new QueryResponse<AppearanceSettingsDto>
            {
                Success = true,
                Data = new List<AppearanceSettingsDto> { appearance },
                TotalItems = 1,
                TotalPages = 1
            };
        }
    }

    public class GetSystemSettingsQueryHandler : IRequestHandler<GetSystemSettingsQuery, QueryResponse<SystemSettingsDto>>
    {
        private readonly IGenericRepository<Setting> _repository;

        public GetSystemSettingsQueryHandler(IGenericRepository<Setting> repository)
        {
            _repository = repository;
        }

        public async Task<QueryResponse<SystemSettingsDto>> Handle(GetSystemSettingsQuery request, CancellationToken cancellationToken)
        {
            var system = new SystemSettingsDto();
            var allSettings = await _repository.GetAllAsync();
            var systemSettings = allSettings.Where(s => s.Category == "System");

            foreach (var setting in systemSettings)
            {
                if (setting.Key.StartsWith("Backup."))
                {
                    var key = setting.Key.Replace("Backup.", "");
                    switch (key)
                    {
                        case "AutoBackup":
                            system.Backup.AutoBackup = bool.Parse(setting.Value);
                            break;
                        case "Frequency":
                            system.Backup.BackupFrequency = setting.Value;
                            break;
                        case "RetentionDays":
                            system.Backup.RetentionDays = int.Parse(setting.Value);
                            break;
                    }
                }
            }

            return new QueryResponse<SystemSettingsDto>
            {
                Success = true,
                Data = new List<SystemSettingsDto> { system },
                TotalItems = 1,
                TotalPages = 1
            };
        }
    }

    public class GetEmailConfigQueryHandler : IRequestHandler<GetEmailConfigQuery, QueryResponse<EmailServerConfigDto>>
    {
        private readonly IGenericRepository<EmailConfiguration> _repository;

        public GetEmailConfigQueryHandler(IGenericRepository<EmailConfiguration> repository)
        {
            _repository = repository;
        }

        public async Task<QueryResponse<EmailServerConfigDto>> Handle(GetEmailConfigQuery request, CancellationToken cancellationToken)
        {
            var emailConfig = new EmailServerConfigDto();
            var configs = await _repository.GetAllAsync();
            var config = configs.FirstOrDefault();

            if (config != null)
            {
                emailConfig.SmtpServer = config.SmtpServer;
                emailConfig.Port = config.Port;
                emailConfig.SenderEmail = config.SenderEmail;
                emailConfig.SenderName = config.SenderName;
                emailConfig.UseSsl = config.UseSsl;
                emailConfig.IsConfigured = true;
            }

            return new QueryResponse<EmailServerConfigDto>
            {
                Success = true,
                Data = new List<EmailServerConfigDto> { emailConfig },
                TotalItems = 1,
                TotalPages = 1
            };
        }
    }

    public class GetSystemHealthQueryHandler : IRequestHandler<GetSystemHealthQuery, QueryResponse<SystemHealthDto>>
    {
        public async Task<QueryResponse<SystemHealthDto>> Handle(GetSystemHealthQuery request, CancellationToken cancellationToken)
        {
            var health = new SystemHealthDto
            {
                DatabaseHealthy = true,
                CacheHealthy = true,
                EmailServiceHealthy = false,
                CpuUsage = 25.5,
                MemoryUsage = 45.2,
                DiskFreeSpace = 1000000000,
                LastBackupDate = DateTime.UtcNow.AddDays(-1),
                ActiveSessions = 5,
                Version = "1.0.0",
                Warnings = new List<string>()
            };

            return new QueryResponse<SystemHealthDto>
            {
                Success = true,
                Data = new List<SystemHealthDto> { health },
                TotalItems = 1,
                TotalPages = 1
            };
        }
    }
    public class GetAllBackupsQueryHandler : IRequestHandler<GetAllBackupsQuery, QueryResponse<List<SystemBackupDto>>>
    {
        private readonly IGenericRepository<SystemBackup> _repository;

        public GetAllBackupsQueryHandler(IGenericRepository<SystemBackup> repository)
        {
            _repository = repository;
        }

        public async Task<QueryResponse<List<SystemBackupDto>>> Handle(GetAllBackupsQuery request, CancellationToken cancellationToken)
        {
            var backups = await _repository.GetAllAsync();
            var backupDtos = new List<SystemBackupDto>();

            foreach (var b in backups)
            {
                backupDtos.Add(new SystemBackupDto
                {
                    Oid = b.Oid,
                    BackupName = b.BackupName,
                    BackupTime = b.BackupTime,
                    BackupSize = b.BackupSize,
                    Status = b.Status
                });
            }

            return new QueryResponse<List<SystemBackupDto>>
            {
                Success = true,
                Data = new List<List<SystemBackupDto>> { backupDtos }, 
                TotalItems = backupDtos.Count,
                TotalPages = 1
            };
        }
    }
}