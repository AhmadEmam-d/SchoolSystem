using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Reports.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Reports.Queries.GetAcademicPerformance
{
    public class GetAcademicPerformanceQueryHandler : IRequestHandler<GetAcademicPerformanceQuery, AcademicPerformanceDto>
    {
        private readonly IGenericRepository<ExamResult> _examResultRepo;
        private readonly IMapper _mapper;

        public GetAcademicPerformanceQueryHandler(IGenericRepository<ExamResult> examResultRepo, IMapper mapper)
        {
            _examResultRepo = examResultRepo;
            _mapper = mapper;
        }

        public async Task<AcademicPerformanceDto> Handle(GetAcademicPerformanceQuery request, CancellationToken cancellationToken)
        {
            var examResults = await _examResultRepo.GetAllQueryable()
                .Include(r => r.Exam)
                .ThenInclude(e => e.Subject)
                .ToListAsync(cancellationToken);

            var subjects = examResults
                .GroupBy(r => r.Exam.Subject.Name)
                .Select(g => new SubjectPerformanceSummaryDto
                {
                    SubjectName = g.Key,
                    AverageScore = Math.Round(g.Average(r => r.Percentage ?? 0), 1),
                    PassRate = Math.Round((double)g.Count(r => r.IsPassed) / g.Count() * 100, 1)
                })
                .ToList();

            return new AcademicPerformanceDto { Subjects = subjects };
        }
    }
}