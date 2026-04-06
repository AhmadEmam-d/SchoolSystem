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
        public string FatherName { get; set; }
        public string MotherName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public ICollection<Student> Students { get; set; } = new List<Student>();
    }

}
