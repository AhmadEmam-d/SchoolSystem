using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Students.DTOs.Read
{
    public class StudentDto
    {
        public Guid Oid { get; set; } = new Guid();
        public string FullName { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; } = new DateTime();
        public string Address { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public Guid ClassOid { get; set; } = new Guid();

        public Guid SectionOid { get; set; } = new Guid();
        public Guid ParentOid { get; set; } = new Guid();
        public Guid UserId { get; set; } = new Guid();
        public string UserName { get; set; } = string.Empty;
        public bool IsDeleted { get; set; }
        public ClassBasicInfoDto Class { get; set; } = new ClassBasicInfoDto();
        public SectionBasicInfoDto Section { get; set; }= new SectionBasicInfoDto();
        public ParentBasicInfoDto Parent { get; set; } = new ParentBasicInfoDto();
    }

    public class ClassBasicInfoDto
    {
        public Guid Oid { get; set; } = new Guid();
        public string Name { get; set; } = string.Empty;
        public string Level { get; set; } = string.Empty;
    }

    public class SectionBasicInfoDto
    {
        public Guid Oid { get; set; } = new Guid();
        public string Name { get; set; } = string.Empty;
    }

    public class ParentBasicInfoDto
    {
        public Guid Oid { get; set; } = new Guid();
        public string FatherName { get; set; } = string.Empty;
        public string MotherName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }
    public class StudentSubjectsCountDto
    {
        public Guid StudentId { get; set; } = new Guid();
        public string StudentName { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public int SubjectsCount { get; set; } = new int();
        public List<string> SubjectsNames { get; set; } = new List<string>();
    }
    public class MySubjectsDto
    {
        public string Title { get; set; } = "My Subjects";
        public string Subtitle { get; set; } = "trackPerformanceSubjects";
        public TotalSubjectsCardDto TotalSubjectsCard { get; set; } = new TotalSubjectsCardDto();
        public List<SubjectDetailsDto> Subjects { get; set; }= new List<SubjectDetailsDto>();
    }

    public class TotalSubjectsCardDto
    {
        public int TotalSubjects { get; set; } = new int();
        public double OverallGrade { get; set; } = new double();
    }

    public class SubjectDetailsDto
    {
        public string SubjectName { get; set; } = string.Empty;
        public string TeacherName { get; set; } = string.Empty;
        public CourseProgressDto CourseProgress { get; set; } = new CourseProgressDto();
        public NextClassDto NextClass { get; set; } = new NextClassDto();
        public PendingAssignmentsDto PendingAssignments { get; set; } = new PendingAssignmentsDto();
        public double? Grade { get; set; } = new double?();
    }

    public class CourseProgressDto
    {
        public int CompletedClasses { get; set; } = new int();
        public int TotalClasses { get; set; } = new int();
        public double Attendance { get; set; } = new double();
        public int CompletedAssignments { get; set; } = new int();
        public int TotalAssignments { get; set; } = new int();
        public string ProgressText => $"{CompletedClasses}/{TotalClasses} classes";
        public string AssignmentsText => $"{CompletedAssignments}/{TotalAssignments}";
    }

    public class NextClassDto
    {
        public string Day { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;
        public string Room { get; set; } = string.Empty;
        public string ViewText => "viewMaterials";
    }

    public class PendingAssignmentsDto
    {
        public int Count { get; set; } = new int();
        public string Text => Count == 1 ? "pendingAssignmentSingular" : "pendingAssignmentPlural";
        public string ViewText => "viewMaterials";
    }
}
