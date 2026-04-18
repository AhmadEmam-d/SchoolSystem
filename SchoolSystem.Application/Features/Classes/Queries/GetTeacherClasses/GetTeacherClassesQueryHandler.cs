using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Classes.DTOs.Read;
using SchoolSystem.Application.Features.Parents.DTOs.Read;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Classes.Queries.GetTeacherClasses
{
    public class GetTeacherClassesQueryHandler : IRequestHandler<GetTeacherClassesQuery, List<ClassResponseDto>>
    {
        private readonly IGenericRepository<Class> _classRepo;
        private readonly IGenericRepository<Teacher> _teacherRepo;

        public GetTeacherClassesQueryHandler(
            IGenericRepository<Class> classRepo,
            IGenericRepository<Teacher> teacherRepo)
        {
            _classRepo = classRepo;
            _teacherRepo = teacherRepo;
        }

        public async Task<List<ClassResponseDto>> Handle(GetTeacherClassesQuery request, CancellationToken cancellationToken)
        {
            // الحصول على المعلم من UserId
            var teacher = await _teacherRepo
                .GetAllQueryable()
                .FirstOrDefaultAsync(t => t.UserId == request.TeacherId, cancellationToken);

            if (teacher == null)
                return new List<ClassResponseDto>();

            // جلب الفصول التي يدرسها المعلم مع الطلاب
            var classes = await _classRepo
                .GetAllQueryable()
                .Include(c => c.Students)
                .Include(c => c.Sections)
                .Where(c => c.TeacherOid == teacher.Oid && !c.IsDeleted)
                .ToListAsync(cancellationToken);

            return classes.Select(c => new ClassResponseDto
            {
                Oid = c.Oid,
                Name = c.Name,
                Level = c.Level,
                CreatedAt = c.CreatedAt,
                StudentsCount = c.Students?.Count(s => !s.IsDeleted) ?? 0,
                SectionsCount = c.Sections?.Count(s => !s.IsDeleted) ?? 0,
                Students = c.Students?.Where(s => !s.IsDeleted).Select(s => new StudentBasicInfoDto
                {
                    Oid = s.Oid,
                    FullName = s.FullName
                }).ToList() ?? new List<StudentBasicInfoDto>()
            }).ToList();
        }
    }
}