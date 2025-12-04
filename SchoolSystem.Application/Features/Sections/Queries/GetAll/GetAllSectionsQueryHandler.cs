using AutoMapper;
using MediatR;
using SchoolSystem.Application.Features.Sections.DTOs.Read;
using SchoolSystem.Application.Features.Sections.Queries.GetAll;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public class GetAllSectionsQueryHandler : IRequestHandler<GetAllSectionsQuery, IEnumerable<SectionDto>>
{
    private readonly IGenericRepository<Section> _repo;
    private readonly IMapper _mapper;

    public GetAllSectionsQueryHandler(IGenericRepository<Section> repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<SectionDto>> Handle(GetAllSectionsQuery request, CancellationToken cancellationToken)
    {
        var sections = await _repo.GetAllAsync();
        return _mapper.Map<IEnumerable<SectionDto>>(sections);
    }
}
