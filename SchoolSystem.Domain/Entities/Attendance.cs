using SchoolSystem.Domain.Common;
using SchoolSystem.Domain.Enums;
using System;

namespace SchoolSystem.Domain.Entities
{
    public class Attendance : BaseEntity
    {
        public Guid StudentOid { get; set; }
        public Student Student { get; set; }

        public Guid ClassOid { get; set; }
        public Class Class { get; set; }

        public DateTime Date { get; set; }
        public AttendanceStatus Status { get; set; }
        public string? Remarks { get; set; }
        public TimeSpan? CheckInTime { get; set; }
        public TimeSpan? CheckOutTime { get; set; }
    }


}