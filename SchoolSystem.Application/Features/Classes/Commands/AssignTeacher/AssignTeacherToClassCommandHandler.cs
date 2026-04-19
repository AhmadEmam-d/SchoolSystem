using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Classes.Commands.AssignTeacher
{
    public class AssignTeacherToClassCommandHandler : IRequestHandler<AssignTeacherToClassCommand, bool>
    {
        private readonly IGenericRepository<Class> _classRepo;
        private readonly IGenericRepository<Teacher> _teacherRepo;

        public AssignTeacherToClassCommandHandler(
            IGenericRepository<Class> classRepo,
            IGenericRepository<Teacher> teacherRepo)
        {
            _classRepo = classRepo;
            _teacherRepo = teacherRepo;
        }

        public async Task<bool> Handle(AssignTeacherToClassCommand request, CancellationToken cancellationToken)
        {
            var classEntity = await _classRepo.GetByOidAsync(request.ClassId);
            if (classEntity == null)
                throw new Exception("Class not found");

            var teacher = await _teacherRepo.GetByOidAsync(request.TeacherId);
            if (teacher == null)
                throw new Exception("Teacher not found");

            classEntity.TeacherOid = teacher.Oid;
            classEntity.UpdatedAt = DateTime.UtcNow;

            await _classRepo.UpdateAsync(classEntity);
            return true;
        }
    }
}