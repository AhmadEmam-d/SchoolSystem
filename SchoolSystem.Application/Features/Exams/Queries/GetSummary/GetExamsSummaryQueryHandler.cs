using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Exams.DTOs;
using SchoolSystem.Application.Features.Lessons.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Exams.Queries.GetSummary
{
    public class GetExamsSummaryQueryHandler : IRequestHandler<GetExamsSummaryQuery, ExamsSummaryDto>
    {
        private readonly IGenericRepository<Exam> _examRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<ExamResult> _examResultRepo;
        private readonly IMapper _mapper;

        public GetExamsSummaryQueryHandler(
            IGenericRepository<Exam> examRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<ExamResult> examResultRepo,
            IMapper mapper)
        {
            _examRepo = examRepo;
            _studentRepo = studentRepo;
            _examResultRepo = examResultRepo;
            _mapper = mapper;
        }

        public async Task<ExamsSummaryDto> Handle(GetExamsSummaryQuery request, CancellationToken cancellationToken)
        {
            var exams = await _examRepo.GetAllQueryable()
                .Include(e => e.Materials)
                .Include(e => e.Subject)
                .Include(e => e.Class)
                .AsSplitQuery()
                .ToListAsync(cancellationToken);

            var totalStudents = await _studentRepo.GetAllQueryable().CountAsync(cancellationToken);

            var totalExams = exams.Count;
            var completedExams = exams.Count(e => e.Status == ExamStatus.Completed);
            var pendingExams = exams.Count(e => e.Status == ExamStatus.Pending);
            var gradingExams = exams.Count(e => e.Status == ExamStatus.Grading);

            // Calculate overall average from completed exams
            var completedExamIds = exams.Where(e => e.Status == ExamStatus.Completed).Select(e => e.Oid).ToList();
            var allResults = await _examResultRepo.GetAllQueryable()
                .Where(r => r.ExamOid.HasValue && completedExamIds.Contains(r.ExamOid.Value))
                .ToListAsync(cancellationToken);

            var overallAverage = allResults.Any() ? allResults.Average(r => r.Percentage ?? 0) : 0;

            var upcomingExams = exams
                .Where(e => e.Date >= DateTime.Today && e.Status != ExamStatus.Completed)
                .OrderBy(e => e.Date)
                .Take(5)
                .Select(e => _mapper.Map<ExamDto>(e))
                .ToList();

            var recentExams = exams
                .Where(e => e.Status == ExamStatus.Completed)
                .OrderByDescending(e => e.Date)
                .Take(5)
                .Select(e => MapToDto(e))
                .ToList();

            return new ExamsSummaryDto
            {
                TotalExams = totalExams,
                CompletedExams = completedExams,
                PendingExams = pendingExams,
                GradingExams = gradingExams,
                TotalStudents = totalStudents,
                OverallAverage = overallAverage,
                UpcomingExams = upcomingExams,
                RecentExams = recentExams
            };

        }
        private static ExamDto MapToDto(Exam e) => new ExamDto
        {
            Oid = e.Oid,
            Name = e.Name ?? "",
            Description = e.Description ?? "",
            Type = e.Type.ToString(),
            SubjectOid = e.SubjectOid,
            SubjectName = e.Subject?.Name ?? "",
            ClassOid = e.ClassOid,
            ClassName = e.Class?.Name ?? "",
            Date = e.Date,
            StartTime = e.StartTime.ToString(@"hh\:mm"),
            Duration = e.Duration.ToString(@"hh\:mm"),
            MaxScore = e.MaxScore,
            PassingScore = e.PassingScore,
            Status = e.Status.ToString(),
            Room = e.Room ?? "",
            Instructions = e.Instructions ?? "",
            StudentsCount = 0,
            Materials = e.Materials?.Select(m => new MaterialResponseDto
            {
                Name = m.Name ?? "",
                FileUrl = m.FileUrl ?? "",
                FileType = m.FileType ?? "",
                FileSize = m.FileSize
            }).ToList() ?? new(),
            Statistics = new ExamStatisticsDto
            {
                TotalStudents = e.Results?.Count ?? 0,
                GradedCount = e.Results?.Count(r => r.GradedAt.HasValue) ?? 0,
                AverageScore = e.Results?.Any() == true ? e.Results.Average(r => r.Percentage ?? 0) : 0,
                HighestScore = e.Results?.Any() == true ? e.Results.Max(r => r.Score) : 0,
                LowestScore = e.Results?.Any() == true ? e.Results.Min(r => r.Score) : 0,
                PassRate = e.Results?.Any() == true
            ? (double)e.Results.Count(r => r.IsPassed) / e.Results.Count * 100 : 0
            }
        };
    }
}