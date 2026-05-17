using SchoolSystem.Domain.Common;
using SchoolSystem.Domain.Enums;
using System;

namespace SchoolSystem.Domain.Entities
{
    public class User : BaseEntity
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public UserRole Role { get; set; }  
        public bool IsActive { get; set; } = true;
        public DateTime? LastLoginAt { get; set; }
        public string Avatar { get; set; } = string.Empty;
        public string? Department { get; set; }
        public string? Position { get; set; }
        public string? EmployeeId { get; set; }

        public Student? Student { get; set; }

        public Teacher? Teacher { get; set; } 

        public Parent? Parent { get; set; } 
        public ICollection<SmartTutorConversation> SmartTutorConversations { get; set; } = new List<SmartTutorConversation>();

    }
}