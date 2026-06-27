using SchoolSystem.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SchoolSystem.Domain.Entities
{
    public class Parent : BaseEntity
    {
        public string FatherName { get; set; } = string.Empty;
        public string MotherName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public User? User { get; set; }
        public Guid? SchoolId { get; set; }
        public School? School { get; set; }
        public ICollection<Student> Students { get; set; } = new List<Student>();
    }

}
