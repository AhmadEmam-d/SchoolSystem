// Application/Features/Settings/Commands/Update/UpdateSettingsCommand.cs
using MediatR;
using SchoolSystem.Application.Features.Settings.DTOs;

namespace SchoolSystem.Application.Features.Settings.Commands.Update
{
    public record UpdateSettingsCommand(SettingsDto Settings) : IRequest<UpdateSettingsCommandResponse>;

    public record UpdateGeneralSettingsCommand(GeneralSettingsDto GeneralSettings) : IRequest<UpdateSettingsCommandResponse>;

    public record UpdateSchoolInfoCommand(SchoolInfoDto SchoolInfo) : IRequest<UpdateSettingsCommandResponse>;

    public record UpdateLanguageSettingsCommand(LanguageSettingsDto LanguageSettings) : IRequest<UpdateSettingsCommandResponse>;

    public record UpdateAppearanceSettingsCommand(AppearanceSettingsDto AppearanceSettings) : IRequest<UpdateSettingsCommandResponse>;

    public record UpdateSystemSettingsCommand(SystemSettingsDto SystemSettings) : IRequest<UpdateSettingsCommandResponse>;

    public record UpdateNotificationPreferencesCommand(NotificationSettingsDto NotificationSettings) : IRequest<UpdateSettingsCommandResponse>;

    public record UpdateSecuritySettingsCommand(SecuritySettingsDto SecuritySettings) : IRequest<UpdateSettingsCommandResponse>;

    public record ChangePasswordCommand(ChangePasswordDto ChangePassword) : IRequest<UpdateSettingsCommandResponse>;

    public record UpdateEmailConfigCommand(EmailServerConfigDto EmailConfig) : IRequest<UpdateSettingsCommandResponse>;

    public record CreateBackupCommand(string? BackupName) : IRequest<CreateBackupCommandResponse>;

    public record RestoreBackupCommand(Guid BackupId) : IRequest<UpdateSettingsCommandResponse>;

    public record DeleteBackupCommand(Guid BackupId) : IRequest<UpdateSettingsCommandResponse>;

    public record TestEmailConfigCommand(EmailServerConfigDto EmailConfig, string TestEmail) : IRequest<TestEmailConfigCommandResponse>;
}

