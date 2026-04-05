// Application/Features/Settings/Handlers/UpdateSettingsCommandHandler.cs
using MediatR;
using Microsoft.Extensions.Caching.Memory;
using SchoolSystem.Application.Features.Settings.Commands.Update;
using SchoolSystem.Application.Features.Settings.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Settings.Commands.Update
{
    public class UpdateSettingsCommandHandler : IRequestHandler<UpdateSettingsCommand, UpdateSettingsCommandResponse>
    {
        private readonly IGenericRepository<Setting> _repository;
        private readonly IMemoryCache _cache;

        public UpdateSettingsCommandHandler(IGenericRepository<Setting> repository, IMemoryCache cache)
        {
            _repository = repository;
            _cache = cache;
        }

        public async Task<UpdateSettingsCommandResponse> Handle(UpdateSettingsCommand request, CancellationToken cancellationToken)
        {
            var settingsList = FlattenSettings(request.Settings);

            foreach (var setting in settingsList)
            {
                var allSettings = await _repository.GetAllAsync();
                var existing = allSettings.FirstOrDefault(s => s.Category == setting.Category && s.Key == setting.Key);

                if (existing != null)
                {
                    existing.Value = setting.Value;
                    existing.UpdatedAt = DateTime.UtcNow;
                    await _repository.UpdateAsync(existing);
                }
                else
                {
                    await _repository.AddAsync(setting);
                }
            }

            _cache.Remove("SystemSettings");
            return new UpdateSettingsCommandResponse { Success = true, Message = "Settings updated successfully" };
        }

        private List<Setting> FlattenSettings(SettingsDto settings)
        {
            var result = new List<Setting>();

            // General - Notifications
            result.Add(CreateSetting("General", "Notifications.EmailNotifications", settings.General.Notifications.EmailNotifications.ToString()));
            result.Add(CreateSetting("General", "Notifications.PushNotifications", settings.General.Notifications.PushNotifications.ToString()));
            result.Add(CreateSetting("General", "Notifications.AttendanceReminders", settings.General.Notifications.AttendanceReminders.ToString()));
            result.Add(CreateSetting("General", "Notifications.GradeUpdates", settings.General.Notifications.GradeUpdates.ToString()));

            // General - Security
            result.Add(CreateSetting("General", "Security.TwoFactorAuth", settings.General.Security.TwoFactorAuthentication.ToString()));
            result.Add(CreateSetting("General", "Security.SessionTimeout", settings.General.Security.SessionTimeoutMinutes.ToString()));

            // School Info
            result.Add(CreateSetting("SchoolInfo", "SchoolName", settings.SchoolInfo.SchoolName));
            result.Add(CreateSetting("SchoolInfo", "SchoolAddress", settings.SchoolInfo.SchoolAddress));
            result.Add(CreateSetting("SchoolInfo", "SchoolPhone", settings.SchoolInfo.SchoolPhone));
            result.Add(CreateSetting("SchoolInfo", "SchoolEmail", settings.SchoolInfo.SchoolEmail));
            result.Add(CreateSetting("SchoolInfo", "PrincipalName", settings.SchoolInfo.PrincipalName));
            result.Add(CreateSetting("SchoolInfo", "EstablishedYear", settings.SchoolInfo.EstablishedYear));
            result.Add(CreateSetting("SchoolInfo", "Website", settings.SchoolInfo.Website));

            // أضف الحقول الجديدة
            result.Add(CreateSetting("SchoolInfo", "DescriptionEn", settings.SchoolInfo.DescriptionEn));
            result.Add(CreateSetting("SchoolInfo", "DescriptionAr", settings.SchoolInfo.DescriptionAr));
            result.Add(CreateSetting("SchoolInfo", "AddressEn", settings.SchoolInfo.AddressEn));
            result.Add(CreateSetting("SchoolInfo", "AddressAr", settings.SchoolInfo.AddressAr));

            // Appearance
            result.Add(CreateSetting("Appearance", "Theme", settings.Appearance.Theme));
            result.Add(CreateSetting("Appearance", "CompactMode", settings.Appearance.CompactMode.ToString()));
            result.Add(CreateSetting("Appearance", "PrimaryColor", settings.Appearance.PrimaryColor));
            result.Add(CreateSetting("Appearance", "RtlMode", settings.Appearance.RtlMode.ToString()));

            // Language
            result.Add(CreateSetting("Language", "DefaultLanguage", settings.Language.DefaultLanguage));
            result.Add(CreateSetting("Language", "DateFormat", settings.Language.DateFormat));
            result.Add(CreateSetting("Language", "Timezone", settings.Language.Timezone));

            // System
            result.Add(CreateSetting("System", "Backup.AutoBackup", settings.System.Backup.AutoBackup.ToString()));
            result.Add(CreateSetting("System", "Backup.Frequency", settings.System.Backup.BackupFrequency));
            result.Add(CreateSetting("System", "Backup.RetentionDays", settings.System.Backup.RetentionDays.ToString()));

            return result;
        }

        private Setting CreateSetting(string category, string key, string value)
        {
            return new Setting
            {
                Oid = Guid.NewGuid(),
                Category = category,
                Key = key,
                Value = value,
                DataType = "string",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
        }
    }

    public class UpdateSchoolInfoCommandHandler : IRequestHandler<UpdateSchoolInfoCommand, UpdateSettingsCommandResponse>
    {
        private readonly IGenericRepository<Setting> _repository;
        private readonly IMemoryCache _cache;

        public UpdateSchoolInfoCommandHandler(IGenericRepository<Setting> repository, IMemoryCache cache)
        {
            _repository = repository;
            _cache = cache;
        }

        public async Task<UpdateSettingsCommandResponse> Handle(UpdateSchoolInfoCommand request, CancellationToken cancellationToken)
        {
            var settings = new[]
            {
            ("SchoolInfo", "SchoolName", request.SchoolInfo.SchoolName),
            ("SchoolInfo", "SchoolAddress", request.SchoolInfo.SchoolAddress),
            ("SchoolInfo", "SchoolPhone", request.SchoolInfo.SchoolPhone),
            ("SchoolInfo", "SchoolEmail", request.SchoolInfo.SchoolEmail),
            ("SchoolInfo", "PrincipalName", request.SchoolInfo.PrincipalName),
            ("SchoolInfo", "EstablishedYear", request.SchoolInfo.EstablishedYear),
            ("SchoolInfo", "Website", request.SchoolInfo.Website),
            // أضف الحقول الجديدة
            ("SchoolInfo", "DescriptionEn", request.SchoolInfo.DescriptionEn),
            ("SchoolInfo", "DescriptionAr", request.SchoolInfo.DescriptionAr),
            ("SchoolInfo", "AddressEn", request.SchoolInfo.AddressEn),
            ("SchoolInfo", "AddressAr", request.SchoolInfo.AddressAr)
        };

            foreach (var (category, key, value) in settings)
            {
                var allSettings = await _repository.GetAllAsync();
                var existing = allSettings.FirstOrDefault(s => s.Category == category && s.Key == key);

                if (existing != null)
                {
                    existing.Value = value;
                    existing.UpdatedAt = DateTime.UtcNow;
                    await _repository.UpdateAsync(existing);
                }
                else if (!string.IsNullOrEmpty(value))
                {
                    await _repository.AddAsync(new Setting
                    {
                        Oid = Guid.NewGuid(),
                        Category = category,
                        Key = key,
                        Value = value,
                        DataType = "string",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                }
            }

            _cache.Remove("SystemSettings");
            return new UpdateSettingsCommandResponse { Success = true, Message = "School info updated successfully" };
        }
    }

    // Similar handlers for other update commands...
    public class UpdateNotificationPreferencesCommandHandler : IRequestHandler<UpdateNotificationPreferencesCommand, UpdateSettingsCommandResponse>
    {
        private readonly IGenericRepository<Setting> _repository;
        private readonly IMemoryCache _cache;

        public UpdateNotificationPreferencesCommandHandler(IGenericRepository<Setting> repository, IMemoryCache cache)
        {
            _repository = repository;
            _cache = cache;
        }

        public async Task<UpdateSettingsCommandResponse> Handle(UpdateNotificationPreferencesCommand request, CancellationToken cancellationToken)
        {
            var settings = new[]
            {
                ("General", "Notifications.EmailNotifications", request.NotificationSettings.EmailNotifications.ToString()),
                ("General", "Notifications.PushNotifications", request.NotificationSettings.PushNotifications.ToString()),
                ("General", "Notifications.AttendanceReminders", request.NotificationSettings.AttendanceReminders.ToString()),
                ("General", "Notifications.GradeUpdates", request.NotificationSettings.GradeUpdates.ToString())
            };

            foreach (var (category, key, value) in settings)
            {
                var allSettings = await _repository.GetAllAsync();
                var existing = allSettings.FirstOrDefault(s => s.Category == category && s.Key == key);

                if (existing != null)
                {
                    existing.Value = value;
                    existing.UpdatedAt = DateTime.UtcNow;
                    await _repository.UpdateAsync(existing);
                }
            }

            _cache.Remove("SystemSettings");
            return new UpdateSettingsCommandResponse { Success = true, Message = "Notification preferences updated successfully" };
        }
    }

    public class CreateBackupCommandHandler : IRequestHandler<CreateBackupCommand, CreateBackupCommandResponse>
    {
        private readonly IGenericRepository<SystemBackup> _repository;

        public CreateBackupCommandHandler(IGenericRepository<SystemBackup> repository)
        {
            _repository = repository;
        }

        public async Task<CreateBackupCommandResponse> Handle(CreateBackupCommand request, CancellationToken cancellationToken)
        {
            var backup = new SystemBackup
            {
                Oid = Guid.NewGuid(),
                BackupName = request.BackupName ?? $"Backup_{DateTime.Now:yyyyMMdd_HHmmss}",
                BackupTime = DateTime.UtcNow,
                BackupPath = $"Backups/{request.BackupName}",
                BackupSize = 1024 * 1024, // Example size
                Status = "Completed",
                CreatedAt = DateTime.UtcNow
            };

            await _repository.AddAsync(backup);

            return new CreateBackupCommandResponse
            {
                Success = true,
                Message = "Backup created successfully",
                Backup = new SystemBackupDto
                {
                    Oid = backup.Oid,
                    BackupName = backup.BackupName,
                    BackupTime = backup.BackupTime,
                    BackupSize = backup.BackupSize,
                    Status = backup.Status
                }
            };
        }
    }
}