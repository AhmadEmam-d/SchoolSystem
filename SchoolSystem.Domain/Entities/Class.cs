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
        public string Description { get; set; }

        public Guid? TeacherOid { get; set; }
        public Teacher? Teacher { get; set; }

        public ICollection<Student> Students { get; set; }
        public ICollection<Section> Sections { get; set; }
    }




}
