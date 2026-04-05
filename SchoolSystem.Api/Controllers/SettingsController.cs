// API/Controllers/SettingsController.cs
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Settings.Commands.Update;
using SchoolSystem.Application.Features.Settings.DTOs;
using SchoolSystem.Application.Features.Settings.Queries.Get;
using SchoolSystem.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SettingsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;

        public SettingsController(IMediator mediator, IMessageService messageService)
        {
            _mediator = mediator;
            _messageService = messageService;
        }

        // GET: api/Settings
        [HttpGet]
        public async Task<IActionResult> GetAllSettings()
        {
            try
            {
                var result = await _mediator.Send(new GetSettingsQuery());
                return Ok(ApiResponseFactory.Success(result.Data, "SettingsFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SettingsFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching settings." }
                ));
            }
        }

        // GET: api/Settings/general
        [HttpGet("general")]
        public async Task<IActionResult> GetGeneralSettings()
        {
            try
            {
                var result = await _mediator.Send(new GetGeneralSettingsQuery());
                return Ok(ApiResponseFactory.Success(result.Data, "GeneralSettingsFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "GeneralSettingsFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching general settings." }
                ));
            }
        }

        // GET: api/Settings/notifications
        [HttpGet("notifications")]
        public async Task<IActionResult> GetNotificationPreferences()
        {
            try
            {
                var result = await _mediator.Send(new GetNotificationPreferencesQuery());
                return Ok(ApiResponseFactory.Success(result.Data, "NotificationPreferencesFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "NotificationPreferencesFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching notification preferences." }
                ));
            }
        }

        // GET: api/Settings/security
        [HttpGet("security")]
        public async Task<IActionResult> GetSecuritySettings()
        {
            try
            {
                var result = await _mediator.Send(new GetSecuritySettingsQuery());
                return Ok(ApiResponseFactory.Success(result.Data, "SecuritySettingsFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SecuritySettingsFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching security settings." }
                ));
            }
        }

        // GET: api/Settings/school-info
        [HttpGet("school-info")]
        public async Task<IActionResult> GetSchoolInfo()
        {
            try
            {
                var result = await _mediator.Send(new GetSchoolInfoQuery());
                return Ok(ApiResponseFactory.Success(result.Data, "SchoolInfoFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SchoolInfoFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching school information." }
                ));
            }
        }

        // GET: api/Settings/language
        [HttpGet("language")]
        public async Task<IActionResult> GetLanguageSettings()
        {
            try
            {
                var result = await _mediator.Send(new GetLanguageSettingsQuery());
                return Ok(ApiResponseFactory.Success(result.Data, "LanguageSettingsFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "LanguageSettingsFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching language settings." }
                ));
            }
        }

        // GET: api/Settings/appearance
        [HttpGet("appearance")]
        public async Task<IActionResult> GetAppearanceSettings()
        {
            try
            {
                var result = await _mediator.Send(new GetAppearanceSettingsQuery());
                return Ok(ApiResponseFactory.Success(result.Data, "AppearanceSettingsFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AppearanceSettingsFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching appearance settings." }
                ));
            }
        }

        // GET: api/Settings/system
        [HttpGet("system")]
        [Authorize(Roles = "SystemAdministrator,Admin")]
        public async Task<IActionResult> GetSystemSettings()
        {
            try
            {
                var result = await _mediator.Send(new GetSystemSettingsQuery());
                return Ok(ApiResponseFactory.Success(result.Data, "SystemSettingsFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SystemSettingsFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching system settings." }
                ));
            }
        }

        // GET: api/Settings/email-config
        [HttpGet("email-config")]
        [Authorize(Roles = "Admin, SystemAdministrator")]
        public async Task<IActionResult> GetEmailConfig()
        {
            try
            {
                var result = await _mediator.Send(new GetEmailConfigQuery());
                return Ok(ApiResponseFactory.Success(result.Data, "EmailConfigFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "EmailConfigFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching email configuration." }
                ));
            }
        }

        // GET: api/Settings/backups
        [HttpGet("backups")]
        [Authorize(Roles = "Admin, SystemAdministrator")]
        public async Task<IActionResult> GetAllBackups()
        {
            try
            {
                var result = await _mediator.Send(new GetAllBackupsQuery());
                return Ok(ApiResponseFactory.Success(result.Data, "BackupsFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "BackupsFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching backups." }
                ));
            }
        }

        // GET: api/Settings/system-health
        [HttpGet("system-health")]
        [Authorize(Roles = "Admin, SystemAdministrator")]
        public async Task<IActionResult> GetSystemHealth()
        {
            try
            {
                var result = await _mediator.Send(new GetSystemHealthQuery());
                return Ok(ApiResponseFactory.Success(result.Data, "SystemHealthFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SystemHealthFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching system health." }
                ));
            }
        }

        // PUT: api/Settings
        [HttpPut]
        [Authorize(Roles = "SystemAdministrator,Admin")]
        public async Task<IActionResult> UpdateSettings([FromBody] UpdateSettingsCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                if (result.Success)
                    return Ok(ApiResponseFactory.Success(true, "SettingsUpdatedSuccessfully", _messageService));

                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SettingsUpdateFailed", _messageService,
                    new List<string> { result.Message ?? "Failed to update settings" }
                ));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SettingsUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // PUT: api/Settings/notifications
        [HttpPut("notifications")]
        public async Task<IActionResult> UpdateNotificationPreferences([FromBody] UpdateNotificationPreferencesCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                return Ok(ApiResponseFactory.Success(result.Success, "NotificationPreferencesUpdatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "NotificationPreferencesUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // PUT: api/Settings/security
        [HttpPut("security")]
        public async Task<IActionResult> UpdateSecuritySettings([FromBody] UpdateSecuritySettingsCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                return Ok(ApiResponseFactory.Success(result.Success, "SecuritySettingsUpdatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SecuritySettingsUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // PUT: api/Settings/school-info
        [HttpPut("school-info")]
        [Authorize(Roles = "SystemAdministrator,Admin")]
        public async Task<IActionResult> UpdateSchoolInfo([FromBody] UpdateSchoolInfoCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                return Ok(ApiResponseFactory.Success(result.Success, "SchoolInfoUpdatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SchoolInfoUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // PUT: api/Settings/language
        [HttpPut("language")]
        [Authorize(Roles = "SystemAdministrator,Admin")]
        public async Task<IActionResult> UpdateLanguageSettings([FromBody] UpdateLanguageSettingsCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                return Ok(ApiResponseFactory.Success(result.Success, "LanguageSettingsUpdatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "LanguageSettingsUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // PUT: api/Settings/appearance
        [HttpPut("appearance")]
        public async Task<IActionResult> UpdateAppearanceSettings([FromBody] UpdateAppearanceSettingsCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                return Ok(ApiResponseFactory.Success(result.Success, "AppearanceSettingsUpdatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AppearanceSettingsUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // PUT: api/Settings/system
        [HttpPut("system")]
        [Authorize(Roles = "SystemAdministrator")]
        public async Task<IActionResult> UpdateSystemSettings([FromBody] UpdateSystemSettingsCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                return Ok(ApiResponseFactory.Success(result.Success, "SystemSettingsUpdatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SystemSettingsUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // PUT: api/Settings/email-config
        [HttpPut("email-config")]
        [Authorize(Roles = "SystemAdministrator")]
        public async Task<IActionResult> UpdateEmailConfig([FromBody] UpdateEmailConfigCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                return Ok(ApiResponseFactory.Success(result.Success, "EmailConfigUpdatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "EmailConfigUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // POST: api/Settings/change-password
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                if (result.Success)
                    return Ok(ApiResponseFactory.Success(true, "PasswordChangedSuccessfully", _messageService));

                return BadRequest(ApiResponseFactory.Failure<object>(
                    "PasswordChangeFailed", _messageService,
                    new List<string> { result.Message ?? "Failed to change password" }
                ));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "PasswordChangeFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // POST: api/Settings/backups/create
        [HttpPost("backups/create")]
        [Authorize(Roles = "Admin, SystemAdministrator")]
        public async Task<IActionResult> CreateBackup([FromBody] CreateBackupCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                if (result.Success)
                    return Ok(ApiResponseFactory.Success(result.Backup, "BackupCreatedSuccessfully", _messageService));

                return BadRequest(ApiResponseFactory.Failure<object>(
                    "BackupCreationFailed", _messageService,
                    new List<string> { result.Message ?? "Failed to create backup" }
                ));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "BackupCreationFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // POST: api/Settings/email-config/test
        [HttpPost("email-config/test")]
        [Authorize(Roles = "Admin, SystemAdministrator")]
        public async Task<IActionResult> TestEmailConfig([FromBody] TestEmailConfigCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                if (result.Success)
                    return Ok(ApiResponseFactory.Success(true, "EmailTestSuccessful", _messageService));

                return BadRequest(ApiResponseFactory.Failure<object>(
                    "EmailTestFailed", _messageService,
                    new List<string> { result.Message ?? "Failed to send test email" }
                ));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "EmailTestFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
    }
}