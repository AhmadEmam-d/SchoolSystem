using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.StudentHomeworks.DTOs
{
    public class StudentHomeworkDashboardDto
    {
        public string Title { get; set; } = "Homework";
        public string Subtitle { get; set; } = "trackSubmitAssignments";
        public HomeworkStatsCardDto Stats { get; set; }=new HomeworkStatsCardDto();
        public List<HomeworkSummaryDto> Homeworks { get; set; }= new List<HomeworkSummaryDto>();
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
        public string Title { get; set; } = string.Empty;
        public string SubjectName { get; set; } = string.Empty;
        public string TeacherName { get; set; }=string.Empty;
        public string Description { get; set; }= string.Empty;
        public DateTime DueDate { get; set; }
        public bool IsOverdue { get; set; }
        public string Status { get; set; }=string.Empty; // Pending, Submitted, Graded, Late
        public decimal? Grade { get; set; }
        public decimal TotalMarks { get; set; }
        public string Priority { get; set; } = string.Empty; // high, medium, low
        public string? AttachmentUrl { get; set; }
        public List<AttachmentDto> Materials { get; set; } = new();
    }

    public class HomeworkDetailsDto
    {
        public Guid HomeworkId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string SubjectName { get; set; } = string.Empty;
        public string TeacherName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Instructions { get; set; } = string.Empty;
        //ublic List<AttachmentDto> Attachments { get; set; }
        public List<AttachmentDto> Materials { get; set; } = new();
        public DateTime DueDate { get; set; }
        public DateTime AssignedDate { get; set; }
        public decimal TotalMarks { get; set; }
        public bool IsOverdue { get; set; }
        public string OverdueText { get; set; } = string.Empty;
        public StudentSubmissionDto? MySubmission { get; set; }
    }

    public class AttachmentDto
    {
        public string FileName { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string SizeText { get; set; } = string.Empty;
    }

    public class StudentSubmissionDto
    {
        public Guid SubmissionId { get; set; }
        public string SubmissionText { get; set; } = string.Empty;
        public string AttachmentUrl { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }
        public decimal? Grade { get; set; }
        public string Feedback { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class SubmitHomeworkDto
    {
        //public Guid HomeworkId { get; set; }
        public string SubmissionText { get; set; } = string.Empty;
        public string AttachmentUrl { get; set; } = string.Empty;
        //public IFormFile? File { get; set; }
    }
}