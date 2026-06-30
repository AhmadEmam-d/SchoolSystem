using SchoolSystem.Domain.Common;
using System;

namespace SchoolSystem.Domain.Entities
{
    public class ClassTeacher : BaseEntity
    {
        public Guid ClassOid { get; set; }
        public Class? Class { get; set; }

        public Guid TeacherOid { get; set; }
        public Teacher? Teacher { get; set; }
    }
}