// Application/Features/Settings/Queries/Get/GetSettingsQueries.cs
using MediatR;
using SchoolSystem.Application.Common;
using SchoolSystem.Application.Features.Settings.DTOs;

namespace SchoolSystem.Application.Features.Settings.Queries.Get
{
    public record GetSettingsQuery : IRequest<QueryResponse<SettingsDto>>;

    public record GetGeneralSettingsQuery : IRequest<QueryResponse<GeneralSettingsDto>>;

    public record GetSchoolInfoQuery : IRequest<QueryResponse<SchoolInfoDto>>;

    public record GetLanguageSettingsQuery : IRequest<QueryResponse<LanguageSettingsDto>>;

    public record GetAppearanceSettingsQuery : IRequest<QueryResponse<AppearanceSettingsDto>>;

    public record GetSystemSettingsQuery : IRequest<QueryResponse<SystemSettingsDto>>;

    public record GetNotificationPreferencesQuery : IRequest<QueryResponse<NotificationSettingsDto>>;

    public record GetSecuritySettingsQuery : IRequest<QueryResponse<SecuritySettingsDto>>;

    public record GetEmailConfigQuery : IRequest<QueryResponse<EmailServerConfigDto>>;

    public record GetAllBackupsQuery : IRequest<QueryResponse<List<SystemBackupDto>>>;

    public record GetSystemHealthQuery : IRequest<QueryResponse<SystemHealthDto>>;
}