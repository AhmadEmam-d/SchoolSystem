using MediatR;
using SchoolSystem.Application.Features.Parents.Commands.Delete;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Threading;
using System.Threading.Tasks;

public class DeleteParentCommandHandler : IRequestHandler<DeleteParentCommand>
{
    private readonly IGenericRepository<Parent> _repo;

    public DeleteParentCommandHandler(IGenericRepository<Parent> repo)
    {
        _repo = repo;
    }

    public async Task Handle(DeleteParentCommand request, CancellationToken cancellationToken)
    {
        await _repo.DeleteAsync(request.Id);
    }
}