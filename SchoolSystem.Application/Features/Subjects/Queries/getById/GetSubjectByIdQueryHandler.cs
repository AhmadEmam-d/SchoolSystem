using AutoMapper;
using MediatR;
using SchoolSystem.Application.Features.Subjects.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

public class GetSubjectByIdQueryHandler : IRequestHandler<GetSubjectByIdQuery, SubjectResponseDto>
{
    private readonly IGenericRepository<Subject> _repo;
    private readonly IMapper _mapper;

    public GetSubjectByIdQueryHandler(IGenericRepository<Subject> repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<SubjectResponseDto> Handle(GetSubjectByIdQuery request, CancellationToken cancellationToken)
    {
        var subject = await _repo.GetByOidAsync(request.Oid);
        if (subject == null) return null;

        return _mapper.Map<SubjectResponseDto>(subject);
    }
}
