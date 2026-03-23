using SchoolSystem.Domain.Common;
using SchoolSystem.Domain.Enums;
using System;

namespace SchoolSystem.Domain.Entities
{
    public class User : BaseEntity
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string PhoneNumber { get; set; }
        public UserRole Role { get; set; }  
        public bool IsActive { get; set; } = true;
        public DateTime? LastLoginAt { get; set; }
        public string Avatar { get; set; }

        public Guid? StudentOid { get; set; }
        public Student Student { get; set; }

        public Guid? TeacherOid { get; set; }
        public Teacher Teacher { get; set; }

        public Guid? ParentOid { get; set; }
        public Parent Parent { get; set; }
    }
}