using SchoolSystem.Domain.Common;

namespace SchoolSystem.Domain.Entities
{
    public class AttendanceSession : BaseEntity
    {
        public Guid ClassOid { get; set; }
        public Class Class { get; set; }
        public Guid TeacherId { get; set; }
        public User Teacher { get; set; }
        public int Method { get; set; } // 1=Manual, 2=QRCode, 3=NumberSelection
        public DateTime StartTime { get; set; }
        public DateTime ExpiresAt { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int? CorrectNumber { get; set; }
        public string? QrCode { get; set; }
    }
}