using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Homeworks.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Homeworks.Queries.GetTeacherHomeworks
{
    public class GetTeacherHomeworksQueryHandler : IRequestHandler<GetTeacherHomeworksQuery, List<HomeworkListResponseDto>>
    {
        private readonly IGenericRepository<Homework> _homeworkRepo;
        private readonly IGenericRepository<Teacher> _teacherRepo;  // ✅ أضف هذا
        private readonly IGenericRepository<Class> _classRepo;
        private readonly IMapper _mapper;

        public GetTeacherHomeworksQueryHandler(
            IGenericRepository<Homework> homeworkRepo,
            IGenericRepository<Teacher> teacherRepo,  // ✅ أضف هذا
            IGenericRepository<Class> classRepo,
            IMapper mapper)
        {
            _homeworkRepo = homeworkRepo;
            _teacherRepo = teacherRepo;
            _classRepo = classRepo;
            _mapper = mapper;
        }

        public async Task<List<HomeworkListResponseDto>> Handle(GetTeacherHomeworksQuery request, CancellationToken cancellationToken)
        {
            // ✅ تحويل UserId (من Token) إلى TeacherOid (من جدول Teachers)
            var teacher = await _teacherRepo
                .GetAllQueryable()
                .FirstOrDefaultAsync(t => t.UserId == request.TeacherId, cancellationToken);

            if (teacher == null)
                return new List<HomeworkListResponseDto>();

            var homeworks = await _homeworkRepo
                .GetAllQueryable()
                .Include(h => h.Class)
                .Include(h => h.Subject)
                .Include(h => h.Submissions)
                .Where(h => h.TeacherOid == teacher.Oid && !h.IsDeleted)  // ✅ استخدم teacher.Oid
                .OrderByDescending(h => h.CreatedAt)
                .ToListAsync(cancellationToken);

            var result = new List<HomeworkListResponseDto>();
            foreach (var homework in homeworks)
            {
                var totalStudents = await _classRepo
                    .GetAllQueryable()
                    .Where(c => c.Oid == homework.ClassOid)
                    .SelectMany(c => c.Students)
                    .CountAsync(s => !s.IsDeleted, cancellationToken);

                var dto = _mapper.Map<HomeworkListResponseDto>(homework);
                dto.TotalStudents = totalStudents;
                result.Add(dto);
            }

            return result;
        }
    }
}