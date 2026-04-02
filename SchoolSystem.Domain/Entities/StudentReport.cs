using SchoolSystem.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Domain.Entities
{
    public class StudentReport : BaseEntity
    {
        public Guid StudentOid { get; set; }
        public Student Student { get; set; }
        public string ReportType { get; set; }
        public double AttendanceRate { get; set; }
        public double AverageGrade { get; set; }
        public int TotalExams { get; set; }
        public int PassedExams { get; set; }
        public int FailedExams { get; set; }
        public DateTime GeneratedAt { get; set; }
    }
}
