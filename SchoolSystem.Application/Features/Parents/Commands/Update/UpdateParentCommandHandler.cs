using AutoMapper;
using MediatR;
using SchoolSystem.Application.Features.Parents.Commands.Update;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

public class UpdateParentCommandHandler : IRequestHandler<UpdateParentCommand>
{
    private readonly IGenericRepository<Parent> _repo;
    private readonly IMapper _mapper;

    public UpdateParentCommandHandler(IGenericRepository<Parent> repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(UpdateParentCommand request, CancellationToken cancellationToken)
    {
        var existing = await _repo.GetByOidAsync(request.Id);
        if (existing == null) throw new Exception("Parent not found");

        _mapper.Map(request.Parent, existing);
        existing.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(existing);
        return Unit.Value;
    }
}
