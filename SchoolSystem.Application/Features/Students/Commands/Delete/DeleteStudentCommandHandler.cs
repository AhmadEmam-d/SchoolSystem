using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Students.Commands
{
    public class DeleteStudentCommandHandler : IRequestHandler<DeleteStudentCommand, Unit>
    {
        private readonly IGenericRepository<Student> _repository;
        private readonly IGenericRepository<User> _userRepo;

        public DeleteStudentCommandHandler(
            IGenericRepository<Student> repository,
            IGenericRepository<User> userRepo)
        {
            _repository = repository;
            _userRepo = userRepo;
        }

        public async Task<Unit> Handle(DeleteStudentCommand request, CancellationToken cancellationToken)
        {
            var student = await _repository.GetByOidAsync(request.Id);
            if (student == null) throw new KeyNotFoundException("Student not found");

            // Soft delete student
            student.IsDeleted = true;
            student.UpdatedAt = DateTime.UtcNow;
            await _repository.UpdateAsync(student);

            // Soft delete linked user
            var user = await _userRepo.GetByOidAsync(student.UserId);
            if (user != null)
            {
                user.IsDeleted = true;
                user.UpdatedAt = DateTime.UtcNow;
                await _userRepo.UpdateAsync(user);
            }

            return Unit.Value;
        }
    }
}
