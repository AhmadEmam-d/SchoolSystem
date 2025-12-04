using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

public class DeleteSubjectCommandHandler : IRequestHandler<DeleteSubjectCommand>
{
    private readonly IGenericRepository<Subject> _repo;

    public DeleteSubjectCommandHandler(IGenericRepository<Subject> repo)
    {
        _repo = repo;
    }

    public async Task<Unit> Handle(DeleteSubjectCommand request, CancellationToken cancellationToken)
    {
        var existing = await _repo.GetByOidAsync(request.Oid);
        if (existing == null) throw new Exception("Subject not found");

        await _repo.DeleteAsync(request.Oid);
        return Unit.Value;
    }
}
