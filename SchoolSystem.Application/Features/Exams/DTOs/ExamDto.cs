using System;
using SchoolSystem.Application.Features.Lessons.DTOs;
using SchoolSystem.Application.Features.Lessons.DTOs.Create;
using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Exams.DTOs
{
    public class ExamDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;    
        public Guid SubjectOid { get; set; }
        public string SubjectName { get; set; } = string.Empty;
        public Guid ClassOid { get; set; }
        public string ClassName { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
        public int MaxScore { get; set; }
        public int PassingScore { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Room { get; set; } = string.Empty;
        public string Instructions { get; set; } = string.Empty;
        public int StudentsCount { get; set; }
        public List<MaterialResponseDto> Materials { get; set; } = new List<MaterialResponseDto>();

        public ExamStatisticsDto Statistics { get; set; }= new ExamStatisticsDto();
    }

    public class ExamStatisticsDto
    {
        public double AverageScore { get; set; }
        public int HighestScore { get; set; }
        public int LowestScore { get; set; }
        public double PassRate { get; set; }
        public int TotalStudents { get; set; }
        public int GradedCount { get; set; }
    }

    public class CreateExamDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public Guid SubjectOid { get; set; }
        public Guid ClassOid { get; set; }
        public DateTime Date { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
        public int MaxScore { get; set; }
        public List<CreateMaterialDto> Materials { get; set; } = new List<CreateMaterialDto>();

        public int PassingScore { get; set; }
        public string Room { get; set; } = string.Empty;
        public string Instructions { get; set; } = string.Empty;
    }

    public class UpdateExamDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public DateTime? Date { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
        public int? MaxScore { get; set; }
        public int? PassingScore { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Room { get; set; } = string.Empty;
        public string Instructions { get; set; } = string.Empty;
    }

    public class ExamResultDto
    {
        public Guid Oid { get; set; }
        public Guid ExamOid { get; set; }
        public string ExamName { get; set; } = string.Empty;
        public Guid StudentOid { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public int Score { get; set; }
        public int? Percentage { get; set; }
        public string Grade { get; set; } = string.Empty;
        public string Remarks { get; set; } = string.Empty;
        public bool IsPassed { get; set; }
        public DateTime SubmittedAt { get; set; }
        public DateTime? GradedAt { get; set; }
    }

    public class CreateExamResultDto
    {
        public Guid ExamOid { get; set; }
        public Guid StudentOid { get; set; }
        public int Score { get; set; }
        public string Remarks { get; set; } = string.Empty;
    }

    public class UpdateExamResultDto
    {
        public Guid Oid { get; set; }
        public int Score { get; set; }
        public string Remarks { get; set; } = string.Empty;
    }

    public class ExamsSummaryDto
    {
        public int TotalExams { get; set; }
        public int CompletedExams { get; set; }
        public int PendingExams { get; set; }
        public int GradingExams { get; set; }
        public int TotalStudents { get; set; }
        public double OverallAverage { get; set; }
        public List<ExamDto> UpcomingExams { get; set; } = new List<ExamDto>();
        public List<ExamDto> RecentExams { get; set; } = new List<ExamDto>();
    }
    public class StudentExamDto
    {
        public Guid ExamId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string SubjectName { get; set; } = string.Empty;
        public string TeacherName { get; set; } = string.Empty;
        public string Instructions { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
        public int MaxScore { get; set; }
        public int PassingScore { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Room { get; set; } = string.Empty;
        public List<ExamMaterialDto> Materials { get; set; } = new();
        public StudentExamSubmissionDto? MySubmission { get; set; }
    }
    public class ExamMaterialDto
    {
        public string Name { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public long FileSize { get; set; }
    }

    public class StudentExamSubmissionDto
    {
        public Guid SubmissionId { get; set; }
        public string? AnswerText { get; set; }
        public string? AttachmentUrl { get; set; }
        public string? FileName { get; set; }
        public DateTime SubmittedAt { get; set; }
        public int? Score { get; set; }
        public string? Feedback { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? GradedAt { get; set; }
        public bool IsGraded => Score.HasValue;
    }

    // Teacher sees this when viewing submissions
    public class ExamSubmissionViewDto
    {
        public Guid SubmissionId { get; set; }
        public Guid StudentId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string? AnswerText { get; set; }
        public string? AttachmentUrl { get; set; }
        public string? FileName { get; set; }
        public DateTime SubmittedAt { get; set; }
        public int? Score { get; set; }
        public string? Feedback { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? GradedAt { get; set; }
        public bool IsGraded => Score.HasValue;
    }

    public class SubmitExamDto
    {
        public string? AnswerText { get; set; }
        public string? AttachmentUrl { get; set; }
        public string? FileName { get; set; }
    }

    public class GradeExamSubmissionDto
    {
        public int Score { get; set; }
        public string? Feedback { get; set; }
    }

    public class UploadExamAttachmentResponseDto
    {
        public string AttachmentUrl { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
    }

}