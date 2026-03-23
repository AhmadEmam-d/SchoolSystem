using MediatR;
using SchoolSystem.Application.Features.Sections.Commands.Delete;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

public class DeleteSectionCommandHandler : IRequestHandler<DeleteSectionCommand>
{
    private readonly IGenericRepository<Section> _repo;

    public DeleteSectionCommandHandler(IGenericRepository<Section> repo)
    {
        _repo = repo;
    }

    public async Task Handle(DeleteSectionCommand request, CancellationToken cancellationToken)
    {
        await _repo.DeleteAsync(request.Id);
    }
}
