using SchoolSystem.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Collections.Specialized.BitVector32;

namespace SchoolSystem.Domain.Entities
{
    public class Class : BaseEntity
    {
        public string Name { get; set; }
        public string Level { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public Guid? TeacherOid { get; set; }
        public Teacher Teacher { get; set; }
        public ICollection<Student> Students { get; set; } = new List<Student>();
        public ICollection<Section> Sections { get; set; } = new List<Section>();
        public ICollection<SchoolSystem.Domain.Entities.Timetable> Timetables { get; set; } = new List<SchoolSystem.Domain.Entities.Timetable>();
        public ICollection<Homework> Homeworks { get; set; } = new List<Homework>();
        public ICollection<AttendanceSession> AttendanceSessions { get; set; } = new List<AttendanceSession>();
    }




}
