using AutoMapper;
using MediatR;
using SchoolSystem.Application.Features.Parents.Commands.Create;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

public class CreateParentCommandHandler : IRequestHandler<CreateParentCommand, Guid>
{
    private readonly IGenericRepository<Parent> _repo;
    private readonly IMapper _mapper;

    public CreateParentCommandHandler(IGenericRepository<Parent> repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<Guid> Handle(CreateParentCommand request, CancellationToken cancellationToken)
    {
        var parent = _mapper.Map<Parent>(request.Parent);
        parent.Oid = Guid.NewGuid();
        parent.CreatedAt = DateTime.UtcNow;

        await _repo.AddAsync(parent);
        return parent.Oid;
    }
}
