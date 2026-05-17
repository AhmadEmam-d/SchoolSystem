using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Teachers.Command.Delete
{
    public class DeleteTeacherCommandHandler : IRequestHandler<DeleteTeacherCommand>
    {
        private readonly IGenericRepository<Teacher> _teacherRepo;
        private readonly IGenericRepository<User> _userRepo;

        public DeleteTeacherCommandHandler(
            IGenericRepository<Teacher> teacherRepo,
            IGenericRepository<User> userRepo)
        {
            _teacherRepo = teacherRepo;
            _userRepo = userRepo;
        }

        public async Task Handle(DeleteTeacherCommand request, CancellationToken cancellationToken)
        {
            var teacher = await _teacherRepo.GetByOidAsync(request.Oid);
            if (teacher == null)
                throw new Exception("Teacher not found");

            teacher.IsDeleted = true;
            teacher.UpdatedAt = DateTime.UtcNow;
            await _teacherRepo.UpdateAsync(teacher);

            var user = await _userRepo.GetByOidAsync(teacher.UserId);
            if (user != null)
            {
                user.IsDeleted = true;
                user.UpdatedAt = DateTime.UtcNow;
                await _userRepo.UpdateAsync(user);
            }
        }
    }
}