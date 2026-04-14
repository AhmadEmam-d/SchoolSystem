using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Homeworks.DTOs.Response;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Homeworks.Queries.GetByOid
{
    public class GetHomeworkByOidQueryHandler : IRequestHandler<GetHomeworkByOidQuery, HomeworkDetailResponseDto>
    {
        private readonly IGenericRepository<Homework> _homeworkRepo;
        private readonly IMapper _mapper;

        public GetHomeworkByOidQueryHandler(
            IGenericRepository<Homework> homeworkRepo,
            IMapper mapper)
        {
            _homeworkRepo = homeworkRepo;
            _mapper = mapper;
        }

        public async Task<HomeworkDetailResponseDto> Handle(
            GetHomeworkByOidQuery request,
            CancellationToken cancellationToken)
        {
            var homework = await _homeworkRepo
                .GetAllQueryable()
                .Include(h => h.Class)
                .ThenInclude(c => c.Students)
                .Include(h => h.Subject)
                .Include(h => h.Teacher)
                .ThenInclude(t => t.User)
                .Include(h => h.Submissions)
                .Include(h => h.Attachments)
                .FirstOrDefaultAsync(h => h.Oid == request.Oid && !h.IsDeleted, cancellationToken);

            if (homework == null)
                throw new Exception("Homework not found");

            return _mapper.Map<HomeworkDetailResponseDto>(homework);
        }
    }
}