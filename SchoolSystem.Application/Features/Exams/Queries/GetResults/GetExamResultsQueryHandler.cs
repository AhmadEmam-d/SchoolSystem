using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Exams.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Exams.Queries.GetResults
{
    public class GetExamResultsQueryHandler : IRequestHandler<GetExamResultsQuery, List<ExamResultDto>>
    {
        private readonly IGenericRepository<ExamResult> _examResultRepo;
        private readonly IMapper _mapper;

        public GetExamResultsQueryHandler(IGenericRepository<ExamResult> examResultRepo, IMapper mapper)
        {
            _examResultRepo = examResultRepo;
            _mapper = mapper;
        }

        public async Task<List<ExamResultDto>> Handle(GetExamResultsQuery request, CancellationToken cancellationToken)
        {
            return await _examResultRepo.GetAllQueryable()
                .Include(r => r.Exam)
                .Include(r => r.Student)
                .Where(r => r.ExamOid == request.ExamOid)
                .OrderByDescending(r => r.Score)
                .ProjectTo<ExamResultDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        }
    }
}