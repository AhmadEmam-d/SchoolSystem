using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Exams.DTOs;
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
                .Include(e => e.Subject)
                .Include(e => e.Class)
                .ToListAsync(cancellationToken);

            var totalStudents = await _studentRepo.GetAllQueryable().CountAsync(cancellationToken);

            var totalExams = exams.Count;
            var completedExams = exams.Count(e => e.Status == ExamStatus.Completed);
            var pendingExams = exams.Count(e => e.Status == ExamStatus.Pending);
            var gradingExams = exams.Count(e => e.Status == ExamStatus.Grading);

            // Calculate overall average from completed exams
            var completedExamIds = exams.Where(e => e.Status == ExamStatus.Completed).Select(e => e.Oid).ToList();
            var allResults = await _examResultRepo.GetAllQueryable()
                .Where(r => completedExamIds.Contains(r.ExamOid))
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
                .Select(e => _mapper.Map<ExamDto>(e))
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
    }
}