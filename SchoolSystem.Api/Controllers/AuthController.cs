using MediatR;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
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
        private readonly IMessageService _messageService;

        public AuthController(IAuthService authService, IMessageService messageService)
        {
            _authService = authService;
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
    }
}