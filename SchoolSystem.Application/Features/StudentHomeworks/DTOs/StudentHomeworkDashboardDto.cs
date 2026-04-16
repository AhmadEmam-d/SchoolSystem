using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.StudentHomeworks.DTOs
{
    public class StudentHomeworkDashboardDto
    {
        public string Title { get; set; } = "Homework";
        public string Subtitle { get; set; } = "trackSubmitAssignments";
        public HomeworkStatsCardDto Stats { get; set; }
        public List<HomeworkSummaryDto> Homeworks { get; set; }
    }

    public class HomeworkStatsCardDto
    {
        public int Pending { get; set; }
        public int Submitted { get; set; }
        public int Graded { get; set; }
    }

    public class HomeworkSummaryDto
    {
        public Guid HomeworkId { get; set; }
        public string Title { get; set; }
        public string SubjectName { get; set; }
        public string TeacherName { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public bool IsOverdue { get; set; }
        public string Status { get; set; } // Pending, Submitted, Graded, Late
        public decimal? Grade { get; set; }
        public decimal TotalMarks { get; set; }
        public string Priority { get; set; } // high, medium, low
    }

    public class HomeworkDetailsDto
    {
        public Guid HomeworkId { get; set; }
        public string Title { get; set; }
        public string Status { get; set; }
        public string Priority { get; set; }
        public string SubjectName { get; set; }
        public string TeacherName { get; set; }
        public string Description { get; set; }
        public string Instructions { get; set; }
        public List<AttachmentDto> Attachments { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime AssignedDate { get; set; }
        public decimal TotalMarks { get; set; }
        public bool IsOverdue { get; set; }
        public string OverdueText { get; set; }
        public StudentSubmissionDto? MySubmission { get; set; }
    }

    public class AttachmentDto
    {
        public string FileName { get; set; }
        public string FileUrl { get; set; }
        public string FileType { get; set; }
        public long FileSize { get; set; }
        public string SizeText { get; set; }
    }

    public class StudentSubmissionDto
    {
        public Guid SubmissionId { get; set; }
        public string SubmissionText { get; set; }
        public string AttachmentUrl { get; set; }
        public DateTime SubmittedAt { get; set; }
        public decimal? Grade { get; set; }
        public string Feedback { get; set; }
        public string Status { get; set; }
    }

    public class SubmitHomeworkDto
    {
        public Guid HomeworkId { get; set; }
        public string SubmissionText { get; set; }
        public string AttachmentUrl { get; set; }
    }
}