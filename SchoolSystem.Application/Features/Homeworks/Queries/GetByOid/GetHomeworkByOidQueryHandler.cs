// Application/Features/Homeworks/Queries/GetById/GetHomeworkByIdQueryHandler.cs
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Homeworks.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Homeworks.Queries.GetById
{
    public class GetHomeworkByIdQueryHandler : IRequestHandler<GetHomeworkByIdQuery, HomeworkDetailResponseDto>
    {
        private readonly IGenericRepository<Homework> _homeworkRepo;
        private readonly IMapper _mapper;

        public GetHomeworkByIdQueryHandler(IGenericRepository<Homework> homeworkRepo, IMapper mapper)
        {
            _homeworkRepo = homeworkRepo;
            _mapper = mapper;
        }

        public async Task<HomeworkDetailResponseDto> Handle(GetHomeworkByIdQuery request, CancellationToken cancellationToken)
        {
            var homework = await _homeworkRepo
                .GetAllQueryable()
                .Include(h => h.Class)
                .Include(h => h.Subject)
                .Include(h => h.Teacher)
                .Include(h => h.Attachments)
                .Include(h => h.Submissions)
                .FirstOrDefaultAsync(h => h.Oid == request.Id && !h.IsDeleted, cancellationToken);

            if (homework == null)
                throw new Exception("Homework not found");

            return _mapper.Map<HomeworkDetailResponseDto>(homework);
        }
    }
}