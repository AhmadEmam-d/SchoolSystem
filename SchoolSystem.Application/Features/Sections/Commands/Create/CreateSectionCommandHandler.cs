using AutoMapper;
using MediatR;
using SchoolSystem.Application.Features.Sections.Commands.Create;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

public class CreateSectionCommandHandler : IRequestHandler<CreateSectionCommand, Guid>
{
    private readonly IGenericRepository<Section> _repo;
    private readonly IMapper _mapper;

    public CreateSectionCommandHandler(IGenericRepository<Section> repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<Guid> Handle(CreateSectionCommand request, CancellationToken cancellationToken)
    {
        var section = _mapper.Map<Section>(request.Section);
        section.Oid = Guid.NewGuid();
        section.CreatedAt = DateTime.UtcNow;

        await _repo.AddAsync(section);
        return section.Oid;
    }
}
