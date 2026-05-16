using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Auth.Commands.AdminResetPassword;
using SchoolSystem.Application.Features.Auth.Commands.ForgotPassword;
using SchoolSystem.Application.Features.Auth.Commands.VerifyOtpAndReset;
using SchoolSystem.Application.Features.Auth.DTOs;
using SchoolSystem.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;

        public AuthController(IAuthService authService, IMediator mediator, IMessageService messageService)
        {
            _authService = authService;
            _mediator = mediator;
            _messageService = messageService;
        }

        // GET: api/Auth/roles
        [HttpGet("roles")]
        public async Task<IActionResult> GetRoles()
        {
            try
            {
                var roles = await _authService.GetAllRolesAsync();
                return Ok(ApiResponseFactory.Success(roles, "RolesFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "RolesFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // POST: api/Auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var result = await _authService.LoginAsync(loginDto);
                return Ok(ApiResponseFactory.Success(result, "LoginSuccessful", _messageService));
            }
            catch (Exception ex)
            {
                return Unauthorized(ApiResponseFactory.Failure<object>(
                    "LoginFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // POST: api/Auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                var result = await _authService.RegisterAsync(registerDto);
                return Ok(ApiResponseFactory.Success(result, "RegistrationSuccessful", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "RegistrationFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // POST: api/Auth/logout
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] string email)
        {
            try
            {
                await _authService.LogoutAsync(email);
                return Ok(ApiResponseFactory.Success(true, "LogoutSuccessful", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "LogoutFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // ============================================
        // 🔐 Forgot Password & Reset Password
        // ============================================

        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            // ← Remove try/catch temporarily to see the real error
            var command = new ForgotPasswordCommand { Email = dto.Email };
            var result = await _mediator.Send(command);

            if (result.Success)
                return Ok(ApiResponseFactory.Success(true, result.Message ?? "Reset code sent successfully", _messageService));

            return BadRequest(ApiResponseFactory.Failure<object>(
                "ResetCodeFailed", _messageService,
                new List<string> { result.Message ?? "Failed to send reset code" }
            ));
        }

        // POST: api/Auth/verify-otp-reset
        [HttpPost("verify-otp-reset")]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyOtpAndReset([FromBody] VerifyOtpDto dto)
        {
            try
            {
                if (dto.NewPassword != dto.ConfirmPassword)
                {
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "PasswordMismatch", _messageService,
                        new List<string> { "New password and confirmation do not match" }
                    ));
                }

                var command = new VerifyOtpAndResetCommand
                {
                    Email = dto.Email,
                    OtpCode = dto.OtpCode,
                    NewPassword = dto.NewPassword
                };
                var result = await _mediator.Send(command);

                if (result.Success)
                {
                    return Ok(ApiResponseFactory.Success(true, result.Message ?? "Password reset successfully", _messageService));
                }

                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ResetFailed", _messageService,
                    new List<string> { result.Message ?? "Failed to reset password" }
                ));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ResetFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // POST: api/Auth/admin-reset-password
        [HttpPost("admin-reset-password")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminResetPassword([FromBody] ResetPasswordByAdminDto dto)
        {
            try
            {
                var command = new AdminResetPasswordCommand { UserId = dto.UserId };
                var result = await _mediator.Send(command);

                if (result.Success)
                {
                    return Ok(ApiResponseFactory.Success(true, result.Message ?? "Password reset successfully", _messageService));
                }

                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AdminResetFailed", _messageService,
                    new List<string> { result.Message ?? "Failed to reset password" }
                ));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AdminResetFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
    }
}
//using MediatR;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using SchoolSystem.Api.Common.Helpers;
//using SchoolSystem.Api.Common.Models;
//using SchoolSystem.Application.Features.Auth.Commands.AdminResetPassword;
//using SchoolSystem.Application.Features.Auth.Commands.ForgotPassword;
//using SchoolSystem.Application.Features.Auth.Commands.VerifyOtpAndReset;
//using SchoolSystem.Application.Features.Auth.DTOs;
//using SchoolSystem.Application.Interfaces.Services;
//using System;
//using System.Collections.Generic;
//using System.Threading.Tasks;

//namespace SchoolSystem.Api.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class AuthController : ControllerBase
//    {
//        private readonly IAuthService _authService;
//        private readonly IMessageService _messageService;

//        public AuthController(IAuthService authService, IMessageService messageService)
//        {
//            _authService = authService;
//            _messageService = messageService;
//        }

//        // GET: api/Auth/roles
//        [HttpGet("roles")]
//        public async Task<IActionResult> GetRoles()
//        {
//            try
//            {
//                var roles = await _authService.GetAllRolesAsync();
//                return Ok(ApiResponseFactory.Success(roles, "RolesFetchedSuccessfully", _messageService));
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ApiResponseFactory.Failure<object>(
//                    "RolesFetchFailed", _messageService,
//                    new List<string> { ex.Message }
//                ));
//            }
//        }

//        // POST: api/Auth/login
//        [HttpPost("login")]
//        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
//        {
//            try
//            {
//                var result = await _authService.LoginAsync(loginDto);
//                return Ok(ApiResponseFactory.Success(result, "LoginSuccessful", _messageService));
//            }
//            catch (Exception ex)
//            {
//                return Unauthorized(ApiResponseFactory.Failure<object>(
//                    "LoginFailed", _messageService,
//                    new List<string> { ex.Message }
//                ));
//            }
//        }

//        // POST: api/Auth/register
//        [HttpPost("register")]
//        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
//        {
//            try
//            {
//                var result = await _authService.RegisterAsync(registerDto);
//                return Ok(ApiResponseFactory.Success(result, "RegistrationSuccessful", _messageService));
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ApiResponseFactory.Failure<object>(
//                    "RegistrationFailed", _messageService,
//                    new List<string> { ex.Message }
//                ));
//            }
//        }

//        // POST: api/Auth/logout
//        [HttpPost("logout")]
//        public async Task<IActionResult> Logout([FromBody] string email)
//        {
//            try
//            {
//                await _authService.LogoutAsync(email);
//                return Ok(ApiResponseFactory.Success(true, "LogoutSuccessful", _messageService));
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ApiResponseFactory.Failure<object>(
//                    "LogoutFailed", _messageService,
//                    new List<string> { ex.Message }
//                ));
//            }
//        }
//        // POST: api/Auth/forgot-password
//        [HttpPost("forgot-password")]
//        [AllowAnonymous]
//        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
//        {
//            try
//            {
//                var command = new ForgotPasswordCommand { Email = dto.Email };
//                var result = await _mediator.Send(command);

//                if (result.Success)
//                {
//                    return Ok(ApiResponseFactory.Success(true, result.Message ?? "Reset code sent successfully", _messageService));
//                }

//                return BadRequest(ApiResponseFactory.Failure<object>(
//                    "ResetCodeFailed", _messageService,
//                    new List<string> { result.Message ?? "Failed to send reset code" }
//                ));
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ApiResponseFactory.Failure<object>(
//                    "ResetCodeFailed", _messageService,
//                    new List<string> { ex.Message }
//                ));
//            }
//        }

//        // POST: api/Auth/verify-otp-reset
//        [HttpPost("verify-otp-reset")]
//        [AllowAnonymous]
//        public async Task<IActionResult> VerifyOtpAndReset([FromBody] VerifyOtpDto dto)
//        {
//            try
//            {
//                if (dto.NewPassword != dto.ConfirmPassword)
//                {
//                    return BadRequest(ApiResponseFactory.Failure<object>(
//                        "PasswordMismatch", _messageService,
//                        new List<string> { "New password and confirmation do not match" }
//                    ));
//                }

//                var command = new VerifyOtpAndResetCommand
//                {
//                    Email = dto.Email,
//                    OtpCode = dto.OtpCode,
//                    NewPassword = dto.NewPassword
//                };
//                var result = await _mediator.Send(command);

//                if (result.Success)
//                {
//                    return Ok(ApiResponseFactory.Success(true, result.Message ?? "Password reset successfully", _messageService));
//                }

//                return BadRequest(ApiResponseFactory.Failure<object>(
//                    "ResetFailed", _messageService,
//                    new List<string> { result.Message ?? "Failed to reset password" }
//                ));
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ApiResponseFactory.Failure<object>(
//                    "ResetFailed", _messageService,
//                    new List<string> { ex.Message }
//                ));
//            }
//        }

//        // POST: api/Auth/admin-reset-password
//        [HttpPost("admin-reset-password")]
//        [Authorize(Roles = "Admin")]
//        public async Task<IActionResult> AdminResetPassword([FromBody] ResetPasswordByAdminDto dto)
//        {
//            try
//            {
//                var command = new AdminResetPasswordCommand { UserId = dto.UserId };
//                var result = await _mediator.Send(command);

//                if (result.Success)
//                {
//                    return Ok(ApiResponseFactory.Success(true, result.Message ?? "Password reset successfully", _messageService));
//                }

//                return BadRequest(ApiResponseFactory.Failure<object>(
//                    "AdminResetFailed", _messageService,
//                    new List<string> { result.Message ?? "Failed to reset password" }
//                ));
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ApiResponseFactory.Failure<object>(
//                    "AdminResetFailed", _messageService,
//                    new List<string> { ex.Message }
//                ));
//            }
//        }
//    }
//}