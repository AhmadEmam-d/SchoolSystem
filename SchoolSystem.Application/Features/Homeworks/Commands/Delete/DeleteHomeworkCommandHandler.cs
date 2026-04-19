// Application/Features/Homeworks/Commands/Delete/DeleteHomeworkCommandHandler.cs
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Homeworks.Commands.Delete
{
    public class DeleteHomeworkCommandHandler : IRequestHandler<DeleteHomeworkCommand, bool>
    {
        private readonly IGenericRepository<Homework> _homeworkRepo;

        public DeleteHomeworkCommandHandler(IGenericRepository<Homework> homeworkRepo)
        {
            _homeworkRepo = homeworkRepo;
        }

        public async Task<bool> Handle(DeleteHomeworkCommand request, CancellationToken cancellationToken)
        {
            var homework = await _homeworkRepo.GetByOidAsync(request.Id);
            if (homework == null)
                throw new Exception("Homework not found");

            homework.IsDeleted = true;
            homework.UpdatedAt = DateTime.UtcNow;
            await _homeworkRepo.UpdateAsync(homework);

            return true;
        }
    }
}