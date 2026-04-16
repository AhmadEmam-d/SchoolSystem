// Application/Features/Homeworks/Queries/GetSubmissions/GetHomeworkSubmissionsQueryHandler.cs
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Homeworks.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Homeworks.Queries.GetSubmissions
{
    public class GetHomeworkSubmissionsQueryHandler : IRequestHandler<GetHomeworkSubmissionsQuery, List<HomeworkSubmissionResponseDto>>
    {
        private readonly IGenericRepository<HomeworkSubmission> _submissionRepo;
        private readonly IMapper _mapper;

        public GetHomeworkSubmissionsQueryHandler(IGenericRepository<HomeworkSubmission> submissionRepo, IMapper mapper)
        {
            _submissionRepo = submissionRepo;
            _mapper = mapper;
        }

        public async Task<List<HomeworkSubmissionResponseDto>> Handle(GetHomeworkSubmissionsQuery request, CancellationToken cancellationToken)
        {
            var submissions = await _submissionRepo
                .GetAllQueryable()
                .Include(s => s.Student)
                .Where(s => s.HomeworkOid == request.HomeworkId && !s.IsDeleted)
                .OrderBy(s => s.Status == SubmissionStatus.Pending ? 0 : 1)
                .ThenByDescending(s => s.SubmittedAt)
                .ToListAsync(cancellationToken);

            return _mapper.Map<List<HomeworkSubmissionResponseDto>>(submissions);
        }
    }
}