using AutoMapper;
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

public class UpdateSubjectCommandHandler : IRequestHandler<UpdateSubjectCommand>
{
    private readonly IGenericRepository<Subject> _repo;
    private readonly IMapper _mapper;

    public UpdateSubjectCommandHandler(IGenericRepository<Subject> repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(UpdateSubjectCommand request, CancellationToken cancellationToken)
    {
        var existing = await _repo.GetByOidAsync(request.Id);
        if (existing == null) throw new Exception("Subject not found");

        _mapper.Map(request.Subject, existing);
        existing.UpdatedAt = DateTime.UtcNow;

        await _repo.UpdateAsync(existing);
        return Unit.Value;
    }
}
