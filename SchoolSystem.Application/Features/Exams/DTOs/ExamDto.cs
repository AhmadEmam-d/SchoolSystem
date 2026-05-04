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
        public string Name { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public Guid SubjectOid { get; set; }
        public string SubjectName { get; set; }
        public Guid ClassOid { get; set; }
        public string ClassName { get; set; }
        public DateTime Date { get; set; }
        public string StartTime { get; set; }
        public string Duration { get; set; }
        public int MaxScore { get; set; }
        public int PassingScore { get; set; }
        public string Status { get; set; }
        public string Room { get; set; }
        public string Instructions { get; set; }
        public int StudentsCount { get; set; }
        public List<MaterialResponseDto> Materials { get; set; }

        public ExamStatisticsDto Statistics { get; set; }
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
        public string Name { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public Guid SubjectOid { get; set; }
        public Guid ClassOid { get; set; }
        public DateTime Date { get; set; }
        public string StartTime { get; set; }
        public string Duration { get; set; }
        public int MaxScore { get; set; }
        public List<CreateMaterialDto> Materials { get; set; } = new List<CreateMaterialDto>();

        public int PassingScore { get; set; }
        public string Room { get; set; }
        public string Instructions { get; set; }
    }

    public class UpdateExamDto
    {
        public Guid Oid { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public DateTime? Date { get; set; }
        public string StartTime { get; set; }
        public string Duration { get; set; }
        public int? MaxScore { get; set; }
        public int? PassingScore { get; set; }
        public string Status { get; set; }
        public string Room { get; set; }
        public string Instructions { get; set; }
    }

    public class ExamResultDto
    {
        public Guid Oid { get; set; }
        public Guid ExamOid { get; set; }
        public string ExamName { get; set; }
        public Guid StudentOid { get; set; }
        public string StudentName { get; set; }
        public int Score { get; set; }
        public int? Percentage { get; set; }
        public string Grade { get; set; }
        public string Remarks { get; set; }
        public bool IsPassed { get; set; }
        public DateTime SubmittedAt { get; set; }
        public DateTime? GradedAt { get; set; }
    }

    public class CreateExamResultDto
    {
        public Guid ExamOid { get; set; }
        public Guid StudentOid { get; set; }
        public int Score { get; set; }
        public string Remarks { get; set; }
    }

    public class UpdateExamResultDto
    {
        public Guid Oid { get; set; }
        public int Score { get; set; }
        public string Remarks { get; set; }
    }

    public class ExamsSummaryDto
    {
        public int TotalExams { get; set; }
        public int CompletedExams { get; set; }
        public int PendingExams { get; set; }
        public int GradingExams { get; set; }
        public int TotalStudents { get; set; }
        public double OverallAverage { get; set; }
        public List<ExamDto> UpcomingExams { get; set; }
        public List<ExamDto> RecentExams { get; set; }
    }
    public class StudentExamDto
    {
        public Guid ExamId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public string SubjectName { get; set; }
        public string TeacherName { get; set; }
        public string Instructions { get; set; }
        public DateTime Date { get; set; }
        public string StartTime { get; set; }
        public string Duration { get; set; }
        public int MaxScore { get; set; }
        public int PassingScore { get; set; }
        public string Status { get; set; }
        public string Room { get; set; }
        public List<ExamMaterialDto> Materials { get; set; } = new();
        public StudentExamSubmissionDto? MySubmission { get; set; }
    }
    public class ExamMaterialDto
    {
        public string Name { get; set; }
        public string FileUrl { get; set; }
        public string FileType { get; set; }
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
        public string Status { get; set; }
        public DateTime? GradedAt { get; set; }
        public bool IsGraded => Score.HasValue;
    }

    // Teacher sees this when viewing submissions
    public class ExamSubmissionViewDto
    {
        public Guid SubmissionId { get; set; }
        public Guid StudentId { get; set; }
        public string StudentName { get; set; }
        public string? AnswerText { get; set; }
        public string? AttachmentUrl { get; set; }
        public string? FileName { get; set; }
        public DateTime SubmittedAt { get; set; }
        public int? Score { get; set; }
        public string? Feedback { get; set; }
        public string Status { get; set; }
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
        public string AttachmentUrl { get; set; }
        public string FileName { get; set; }
    }

}