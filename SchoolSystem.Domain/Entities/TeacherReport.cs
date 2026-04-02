using SchoolSystem.Domain.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Domain.Entities
{
    public class TeacherReport : BaseEntity
    {
        public Guid TeacherOid { get; set; }
        public Teacher Teacher { get; set; }
        public string ReportType { get; set; }
        public int TotalClasses { get; set; }
        public int TotalStudents { get; set; }
        public double AverageClassAttendance { get; set; }
        public double AverageStudentGrade { get; set; }
        public DateTime GeneratedAt { get; set; }
    }

}
