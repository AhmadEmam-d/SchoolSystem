using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Parents.DTOs.Read;
using SchoolSystem.Application.Features.Parents.Queries.GetById;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Threading;
using System.Threading.Tasks;

public class GetParentByIdQueryHandler : IRequestHandler<GetParentByIdQuery, ParentDto>
{
    private readonly IGenericRepository<Parent> _repo;
    private readonly IMapper _mapper;

    public GetParentByIdQueryHandler(IGenericRepository<Parent> repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<ParentDto> Handle(GetParentByIdQuery request, CancellationToken cancellationToken)
    {
        var parent = await _repo.GetAllQueryable()
            .Include(p => p.Students) 
            .FirstOrDefaultAsync(p => p.Oid == request.Id, cancellationToken);

        return _mapper.Map<ParentDto>(parent);
    }
}