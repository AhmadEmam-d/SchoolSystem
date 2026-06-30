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
        private readonly IGenericRepository<ClassTeacher> _classTeacherRepo;

        public AssignTeacherToClassCommandHandler(
            IGenericRepository<Class> classRepo,
            IGenericRepository<Teacher> teacherRepo,
            IGenericRepository<ClassTeacher> classTeacherRepo)
        {
            _classRepo = classRepo;
            _teacherRepo = teacherRepo;
            _classTeacherRepo = classTeacherRepo;
        }

        public async Task<bool> Handle(AssignTeacherToClassCommand request, CancellationToken cancellationToken)
        {
            var classEntity = await _classRepo.GetByOidAsync(request.ClassId);
            if (classEntity == null)
                throw new Exception("Class not found");

            var teacher = await _teacherRepo.GetByOidAsync(request.TeacherId);
            if (teacher == null)
                throw new Exception("Teacher not found");

            var alreadyAssigned = await _classTeacherRepo
                .GetAllQueryable()
                .AnyAsync(ct => ct.ClassOid == classEntity.Oid && ct.TeacherOid == teacher.Oid && !ct.IsDeleted, cancellationToken);

            if (alreadyAssigned)
                return true; 

            var classTeacher = new ClassTeacher
            {
                Oid = Guid.NewGuid(),
                ClassOid = classEntity.Oid,
                TeacherOid = teacher.Oid,
                CreatedAt = DateTime.UtcNow
            };

            await _classTeacherRepo.AddAsync(classTeacher);
            return true;
        }
    }
}