using AutoMapper;
using MediatR;
using SchoolSystem.Application.Features.Sections.Commands.Update;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

public class UpdateSectionCommandHandler : IRequestHandler<UpdateSectionCommand>
{
    private readonly IGenericRepository<Section> _repo;
    private readonly IMapper _mapper;

    public UpdateSectionCommandHandler(IGenericRepository<Section> repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(UpdateSectionCommand request, CancellationToken cancellationToken)
    {
        var existing = await _repo.GetByOidAsync(request.Id);
        if (existing == null) throw new Exception("Section not found");

        _mapper.Map(request.Section, existing);
        existing.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(existing);
        return Unit.Value;
    }
}
