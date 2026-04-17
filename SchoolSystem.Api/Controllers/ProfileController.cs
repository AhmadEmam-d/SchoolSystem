      // API/Controllers/ProfileController.cs
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Application.Features.UserProfile.Commands;
using SchoolSystem.Application.Features.UserProfile.DTOs;
using SchoolSystem.Application.Features.UserProfile.Queries;
using SchoolSystem.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolSystem.Api.Controllers
{
        [ApiController]
        [Route("api/[controller]")]
        [Authorize]
        public class ProfileController : ControllerBase
        {
            private readonly IMediator _mediator;
            private readonly IMessageService _messageService;

            public ProfileController(IMediator mediator, IMessageService messageService)
            {
                _mediator = mediator;
                _messageService = messageService;
            }

            // GET: api/Profile
            [HttpGet]
            public async Task<IActionResult> GetProfile()
            {
                try
                {
                    var result = await _mediator.Send(new GetUserProfileQuery());
                    if (result.Success && result.Data.Count > 0)
                    {
                        return Ok(ApiResponseFactory.Success(result.Data[0], "ProfileFetchedSuccessfully", _messageService));
                    }
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "ProfileFetchFailed", _messageService,
                        new List<string> { result.Message ?? "Failed to fetch profile" }
                    ));
                }
                catch (Exception ex)
                {
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "ProfileFetchFailed", _messageService,
                        new List<string> { ex.Message }
                    ));
                }
            }

            // PUT: api/Profile
            [HttpPut]
            public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfileCommand command)
            {
                try
                {
                    var result = await _mediator.Send(command);
                    if (result.Success)
                    {
                        return Ok(ApiResponseFactory.Success(true, "ProfileUpdatedSuccessfully", _messageService));
                    }
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "ProfileUpdateFailed", _messageService,
                        new List<string> { result.Message ?? "Failed to update profile" }
                    ));
                }
                catch (Exception ex)
                {
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "ProfileUpdateFailed", _messageService,
                        new List<string> { ex.Message }
                    ));
                }
            }

        // POST: api/Profile/change-password
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangeUserPasswordDto passwordData)
        {
            try
            {
                var command = new ChangeUserPasswordCommand(passwordData);
                var result = await _mediator.Send(command);
                if (result.Success)
                {
                    return Ok(ApiResponseFactory.Success(true, "PasswordChangedSuccessfully", _messageService));
                }
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
        [HttpGet("test-bcrypt")]
        public IActionResult TestBcrypt()
        {
            var hash = "$2a$11$q5M3ZBJkQ3QZ5QZ5QZ5QZuVGQnQ3ZQ5QZ5QZ5QZ5QZ5QZ5QZ5QZu";
            var password = "Admin@123";
            var isValid = BCrypt.Net.BCrypt.Verify(password, hash);

            return Ok(new { hash, password, isValid });
        }
        [HttpGet("generate-hashes")]
        [AllowAnonymous]
        public IActionResult GenerateHashes()
        {
            return Ok(new
            {
                TempPassword123 = BCrypt.Net.BCrypt.HashPassword("TempPassword123!"),
                Admin123 = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Parent123 = BCrypt.Net.BCrypt.HashPassword("Parent@123"),
                Student123 = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                Teacher123 = BCrypt.Net.BCrypt.HashPassword("Teacher@123"),
            });
        }
        //// POST: api/Profile/upload-avatar
        //[HttpPost("upload-avatar")]
        //[Consumes("multipart/form-data")]  // أضف هذا
        //public async Task<IActionResult> UploadAvatar([FromForm] IFormFile file)
        //{
        //    try
        //    {
        //        if (file == null || file.Length == 0)
        //        {
        //            return BadRequest(ApiResponseFactory.Failure<object>(
        //                "AvatarUploadFailed", _messageService,
        //                new List<string> { "No file uploaded" }
        //            ));
        //        }

        //        // تحقق من نوع الملف
        //        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
        //        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        //        if (!allowedExtensions.Contains(extension))
        //        {
        //            return BadRequest(ApiResponseFactory.Failure<object>(
        //                "AvatarUploadFailed", _messageService,
        //                new List<string> { "Invalid file format. Only JPG, PNG, GIF are allowed." }
        //            ));
        //        }

        //        // تحقق من حجم الملف (max 5MB)
        //        if (file.Length > 5 * 1024 * 1024)
        //        {
        //            return BadRequest(ApiResponseFactory.Failure<object>(
        //                "AvatarUploadFailed", _messageService,
        //                new List<string> { "File size exceeds 5MB limit" }
        //            ));
        //        }

        //        // حفظ الملف
        //        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "avatars");
        //        if (!Directory.Exists(uploadsFolder))
        //        {
        //            Directory.CreateDirectory(uploadsFolder);
        //        }

        //        var fileName = $"{Guid.NewGuid()}{extension}";
        //        var filePath = Path.Combine(uploadsFolder, fileName);

        //        using (var stream = new FileStream(filePath, FileMode.Create))
        //        {
        //            await file.CopyToAsync(stream);
        //        }

        //        var avatarUrl = $"/uploads/avatars/{fileName}";

        //        // تحديث الـ Avatar في قاعدة البيانات
        //        var updateResult = await _mediator.Send(new UpdateUserAvatarCommand(avatarUrl));

        //        if (updateResult.Success)
        //        {
        //            return Ok(ApiResponseFactory.Success(new { avatarUrl }, "AvatarUploadedSuccessfully", _messageService));
        //        }

        //        return BadRequest(ApiResponseFactory.Failure<object>(
        //            "AvatarUploadFailed", _messageService,
        //            new List<string> { updateResult.Message ?? "Failed to update avatar" }
        //        ));
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ApiResponseFactory.Failure<object>(
        //            "AvatarUploadFailed", _messageService,
        //            new List<string> { ex.Message }
        //        ));
        //    }
        //}

        // GET: api/Profile/activity
        [HttpGet("activity")]
            public async Task<IActionResult> GetRecentActivity()
            {
                try
                {
                    var result = await _mediator.Send(new GetUserActivityQuery());
                    if (result.Success)
                    {
                        return Ok(ApiResponseFactory.Success(result.Data, "ActivityFetchedSuccessfully", _messageService));
                    }
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "ActivityFetchFailed", _messageService,
                        new List<string> { result.Message ?? "Failed to fetch activity" }
                    ));
                }
                catch (Exception ex)
                {
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "ActivityFetchFailed", _messageService,
                        new List<string> { ex.Message }
                    ));
                }
            }
        }
}
