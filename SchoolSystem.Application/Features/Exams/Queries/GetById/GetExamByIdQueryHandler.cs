using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Exams.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Exams.Queries.GetById
{
    public class GetExamByIdQueryHandler : IRequestHandler<GetExamByIdQuery, ExamDto>
    {
        private readonly IGenericRepository<Exam> _examRepo;
        private readonly IMapper _mapper;

        public GetExamByIdQueryHandler(IGenericRepository<Exam> examRepo, IMapper mapper)
        {
            _examRepo = examRepo;
            _mapper = mapper;
        }

        public async Task<ExamDto> Handle(GetExamByIdQuery request, CancellationToken cancellationToken)
        {
            var exam = await _examRepo.GetAllQueryable()
                .Include(e => e.Subject)
                .Include(e => e.Class)
                .Where(e => e.Oid == request.Oid)
                .ProjectTo<ExamDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(cancellationToken);

            if (exam != null)
            {
                // Calculate statistics
                var results = await _examRepo.GetAllQueryable()
                    .Where(e => e.Oid == request.Oid)
                    .SelectMany(e => e.Results)
                    .ToListAsync(cancellationToken);

                if (results.Any())
                {
                    exam.Statistics = new ExamStatisticsDto
                    {
                        AverageScore = results.Average(r => r.Score),
                        HighestScore = results.Max(r => r.Score),
                        LowestScore = results.Min(r => r.Score),
                        PassRate = results.Count(r => r.IsPassed) * 100.0 / results.Count,
                        TotalStudents = results.Count,
                        GradedCount = results.Count(r => r.GradedAt.HasValue)
                    };
                }
                exam.StudentsCount = results?.Count ?? 0;
            }

            return exam;
        }
    }
}