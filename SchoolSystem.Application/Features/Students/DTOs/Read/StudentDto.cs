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
    public class MySubjectsDto
    {
        public string Title { get; set; } = "My Subjects";
        public string Subtitle { get; set; } = "trackPerformanceSubjects";
        public TotalSubjectsCardDto TotalSubjectsCard { get; set; }
        public List<SubjectDetailsDto> Subjects { get; set; }
    }

    public class TotalSubjectsCardDto
    {
        public int TotalSubjects { get; set; }
        public double OverallGrade { get; set; }
    }

    public class SubjectDetailsDto
    {
        public string SubjectName { get; set; }
        public string TeacherName { get; set; }
        public CourseProgressDto CourseProgress { get; set; }
        public NextClassDto NextClass { get; set; }
        public PendingAssignmentsDto PendingAssignments { get; set; }
        public double? Grade { get; set; }
    }

    public class CourseProgressDto
    {
        public int CompletedClasses { get; set; }
        public int TotalClasses { get; set; }
        public double Attendance { get; set; }
        public int CompletedAssignments { get; set; }
        public int TotalAssignments { get; set; }
        public string ProgressText => $"{CompletedClasses}/{TotalClasses} classes";
        public string AssignmentsText => $"{CompletedAssignments}/{TotalAssignments}";
    }

    public class NextClassDto
    {
        public string Day { get; set; }
        public string Time { get; set; }
        public string Room { get; set; }
        public string ViewText => "viewMaterials";
    }

    public class PendingAssignmentsDto
    {
        public int Count { get; set; }
        public string Text => Count == 1 ? "pendingAssignmentSingular" : "pendingAssignmentPlural";
        public string ViewText => "viewMaterials";
    }
}
