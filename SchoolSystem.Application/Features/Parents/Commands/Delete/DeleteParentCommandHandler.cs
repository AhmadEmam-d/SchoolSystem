using MediatR;
using SchoolSystem.Application.Features.Parents.Commands.Delete;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

public class DeleteParentCommandHandler : IRequestHandler<DeleteParentCommand>
{
    private readonly IGenericRepository<Parent> _repo;
    private readonly IGenericRepository<User> _userRepo;

    public DeleteParentCommandHandler(
        IGenericRepository<Parent> repo,
        IGenericRepository<User> userRepo)
    {
        _repo = repo;
        _userRepo = userRepo;
    }

    public async Task Handle(DeleteParentCommand request, CancellationToken cancellationToken)
    {
        var parent = await _repo.GetByOidAsync(request.Id);
        if (parent == null)
            throw new Exception("Parent not found");

        parent.IsDeleted = true;
        parent.UpdatedAt = DateTime.UtcNow;
        await _repo.UpdateAsync(parent);

        var user = await _userRepo.GetByOidAsync(parent.UserId);
        if (user != null)
        {
            user.IsDeleted = true;
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepo.UpdateAsync(user);
        }
    }
}