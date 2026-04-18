using SchoolSystem.Domain.Common;

namespace SchoolSystem.Domain.Entities
{
    public class PasswordResetToken : BaseEntity
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public DateTime ExpiresAt { get; set; }
        public bool IsUsed { get; set; }
    }
}