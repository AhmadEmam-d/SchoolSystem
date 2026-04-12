// Application/Features/Lessons/Commands/Delete/DeleteLessonCommandHandler.cs
using MediatR;
using SchoolSystem.Application.Features.Lessons.Commands.Delete;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Lessons.Commands.Delete
{
    public class DeleteLessonCommandHandler : IRequestHandler<DeleteLessonCommand, bool>
    {
        private readonly IGenericRepository<Lesson> _lessonRepo;

        public DeleteLessonCommandHandler(IGenericRepository<Lesson> lessonRepo)
        {
            _lessonRepo = lessonRepo;
        }

        public async Task<bool> Handle(DeleteLessonCommand request, CancellationToken cancellationToken)
        {
            var lesson = await _lessonRepo.GetByOidAsync(request.Oid);

            if (lesson == null)
                throw new Exception("Lesson not found");

            lesson.IsDeleted = true;
            lesson.UpdatedAt = DateTime.UtcNow;

            await _lessonRepo.UpdateAsync(lesson);

            return true;
        }
    }
}