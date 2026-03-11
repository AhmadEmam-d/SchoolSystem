using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Subjects.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public class GetAllSubjectsQueryHandler : IRequestHandler<GetAllSubjectsQuery, List<SubjectResponseDto>>
{
    private readonly IGenericRepository<Subject> _repo;
    private readonly IMapper _mapper;

    public GetAllSubjectsQueryHandler(IGenericRepository<Subject> repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<List<SubjectResponseDto>> Handle(GetAllSubjectsQuery request, CancellationToken cancellationToken)
    {
        return await _repo
            .GetAllQueryable()
            .ProjectTo<SubjectResponseDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
