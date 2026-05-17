using SchoolSystem.Domain.Enums;
using System;
using System.ComponentModel.DataAnnotations;

namespace SchoolSystem.Application.Features.Auth.DTOs
{
    public class RoleDto
    {
        public UserRole Role { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        public UserRole Role { get; set; }
    }

    public class RegisterDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;    

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [Compare("Password")]
        public string ConfirmPassword { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        public UserRole Role { get; set; }
    }

    public class AuthResponseDto
    {
        public Guid UserId { get; set; }
        public Guid? TeacherId { get; set; }  
        public Guid? StudentId { get; set; }  
        public Guid? ParentId { get; set; }   
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public string Token { get; set; } = string.Empty;
        public string RedirectTo { get; set; } = string.Empty;
    }

    public class UserDto
    {
        public Guid Oid { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public bool IsActive { get; set; }
        public DateTime? LastLoginAt { get; set; }
    }
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }

    public class VerifyOtpDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string OtpCode { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; } = string.Empty;

        [Required]
        [Compare("NewPassword")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }

    public class ResetPasswordByAdminDto
    {
        [Required]
        public Guid UserId { get; set; }
    }
}