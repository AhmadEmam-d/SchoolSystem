// Application/Features/Profile/DTOs/UserProfileDto.cs (غير اسم الملف)
namespace SchoolSystem.Application.Features.UserProfile.DTOs
{
    public class UserProfileDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
    }

    public class UpdateUserProfileDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
    }

    public class ChangeUserPasswordDto
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }
    public class UserActivityDto
    {
        public string Action { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime PerformedAt { get; set; }
        public string? IpAddress { get; set; }
    }
}