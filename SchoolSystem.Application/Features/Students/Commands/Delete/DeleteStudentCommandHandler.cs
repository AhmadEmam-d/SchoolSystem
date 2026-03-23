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

        public DeleteStudentCommandHandler(IGenericRepository<Student> repository)
        {
            _repository = repository;
        }

        public async Task<Unit> Handle(DeleteStudentCommand request, CancellationToken cancellationToken)
        {
            var student = await _repository.GetByOidAsync(request.Id);
            if (student == null) throw new KeyNotFoundException("Student not found");

            student.IsDeleted = true;
            student.UpdatedAt = System.DateTime.UtcNow;

            await _repository.UpdateAsync(student);

            return Unit.Value; 
        }
    }
}
