using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Classes.DTOs.Read;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Classes.Queries.GetAll
{
    public class GetAllClassesQueryHandler
        : IRequestHandler<GetAllClassesQuery, IEnumerable<ClassResponseDto>>
    {
        private readonly IGenericRepository<Class> _repo;
        private readonly IMapper _mapper;

        public GetAllClassesQueryHandler(IGenericRepository<Class> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ClassResponseDto>> Handle(GetAllClassesQuery request, CancellationToken cancellationToken)
        {
            var classes = await _repo.GetAllQueryable()
                .Include(c => c.Students)
                .Include(c => c.Sections)
                .Where(c => !c.IsDeleted)
                .ToListAsync(cancellationToken);

            return _mapper.Map<IEnumerable<ClassResponseDto>>(classes);
        }
    }
}