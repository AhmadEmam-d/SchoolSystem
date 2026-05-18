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
                    .ThenInclude(e => e!.Subject)
                .Where(r => r.Exam != null && r.Exam.Subject != null)
                .ToListAsync(cancellationToken);

            var subjects = examResults
                .GroupBy(r => r.Exam!.Subject!.Name)
                .Select(g => _mapper.Map<SubjectPerformanceSummaryDto>(g))
                .ToList();

            return _mapper.Map<AcademicPerformanceDto>(subjects);
        }
    }
}