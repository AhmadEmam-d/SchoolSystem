using SchoolSystem.Domain.Common;
using System;

namespace SchoolSystem.Domain.Entities
{
    public class Timetable : BaseEntity
    {
        public Guid ClassOid { get; set; }
        public Class Class { get; set; }

        public Guid SubjectOid { get; set; }
        public Subject Subject { get; set; }

        public Guid TeacherOid { get; set; }
        public Teacher Teacher { get; set; }

        public System.DayOfWeek Day { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }

        public string Room { get; set; }
        public int Period { get; set; }
    }

}