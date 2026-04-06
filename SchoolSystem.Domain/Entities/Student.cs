using SchoolSystem.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using static System.Collections.Specialized.BitVector32;

namespace SchoolSystem.Domain.Entities
{
    public class Student : BaseEntity
    {
        
        public string FullName { get; set; }
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }

        public string Address { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        public Guid ClassOid { get; set; }
        public Class Class { get; set; }

        public Guid SectionOid { get; set; }
         public Section Section { get; set; }

        public Guid ParentOid { get; set; }
        public Parent Parent { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public ICollection<Attendance> AttendanceRecords { get; set; } = new List<Attendance>();
        public ICollection<ExamResult> ExamResults { get; set; } = new List<ExamResult>();
        public ICollection<FeeInvoice> FeeInvoices { get; set; } = new List<FeeInvoice>();
    }


}
