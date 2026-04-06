using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore; 
using SchoolSystem.Application.Features.Parents.DTOs.Read;
using SchoolSystem.Application.Features.Parents.Queries.GetAll;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Collections.Generic;
using System.Linq;  
using System.Threading;
using System.Threading.Tasks;

public class GetAllParentsQueryHandler : IRequestHandler<GetAllParentsQuery, IEnumerable<ParentDto>>
{
    private readonly IGenericRepository<Parent> _repo;
    private readonly IMapper _mapper;

    public GetAllParentsQueryHandler(IGenericRepository<Parent> repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ParentDto>> Handle(GetAllParentsQuery request, CancellationToken cancellationToken)
    {
        var parents = await _repo.GetAllQueryable()
            .Include(p => p.User)
            .Include(p => p.Students)  
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<ParentDto>>(parents);
    }
}