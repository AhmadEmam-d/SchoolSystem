using AutoMapper;
using MediatR;
using SchoolSystem.Application.Features.Parents.DTOs.Read;
using SchoolSystem.Application.Features.Parents.Queries.GetById;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

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
        var parent = await _repo.GetByOidAsync(request.Id);
        return _mapper.Map<ParentDto>(parent);
    }
}
