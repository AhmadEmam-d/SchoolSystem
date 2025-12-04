using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Teachers.Command.Delete
{
    public class DeleteTeacherCommandHandler : IRequestHandler<DeleteTeacherCommand>
    {
        private readonly IGenericRepository<Teacher> _teacherRepo;

        public DeleteTeacherCommandHandler(IGenericRepository<Teacher> teacherRepo)
        {
            _teacherRepo = teacherRepo;
        }

        public async Task<Unit> Handle(DeleteTeacherCommand request, CancellationToken cancellationToken)
        {
            var existing = await _teacherRepo.GetByOidAsync(request.Oid);
            if (existing == null)
                throw new Exception("Teacher not found");

            await _teacherRepo.DeleteAsync(request.Oid);

            return Unit.Value;
        }
    }
}
