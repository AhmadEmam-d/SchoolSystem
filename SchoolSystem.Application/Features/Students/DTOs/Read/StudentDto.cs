using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Students.DTOs.Read
{
    public class StudentDto
    {
        public Guid Oid { get; set; }
        public string FullName { get; set; }
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public Guid ClassOid { get; set; }

        public Guid SectionOid { get; set; }
        public Guid ParentOid { get; set; }
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public ClassBasicInfoDto Class { get; set; }
        public SectionBasicInfoDto Section { get; set; }
        public ParentBasicInfoDto Parent { get; set; }
    }

    public class ClassBasicInfoDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; }
        public string Level { get; set; }
    }

    public class SectionBasicInfoDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; }
    }

    public class ParentBasicInfoDto
    {
        public Guid Oid { get; set; }
        public string FatherName { get; set; }
        public string MotherName { get; set; }
        public string Phone { get; set; }
    }
    public class StudentSubjectsCountDto
    {
        public Guid StudentId { get; set; }
        public string StudentName { get; set; }
        public string ClassName { get; set; }
        public int SubjectsCount { get; set; }
        public List<string> SubjectsNames { get; set; }
    }
}
