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
        private readonly IGenericRepository<Teacher> _teacherRepo;
        private readonly IGenericRepository<Class> _classRepo;
        private readonly IMapper _mapper;


        public GetTeacherHomeworksQueryHandler(
            IGenericRepository<Homework> homeworkRepo,
            IGenericRepository<Teacher> teacherRepo,
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
            var teacher = await _teacherRepo
                .GetAllQueryable()
                .FirstOrDefaultAsync(t => t.UserId == request.TeacherId, cancellationToken);

            if (teacher == null)
                return new List<HomeworkListResponseDto>();

            var homeworks = await _homeworkRepo
                .GetAllQueryable()
                .Where(h => h.TeacherOid == teacher.Oid && !h.IsDeleted)
                .Include(h => h.Class)
                    .ThenInclude(c => c.Students.Where(s => !s.IsDeleted)) 
                .Include(h => h.Subject)
                .Include(h => h.Submissions)
                .Include(h => h.Materials)
                .OrderByDescending(h => h.CreatedAt)
                .ToListAsync(cancellationToken);

            var result = homeworks.Select(homework =>
            {
                var dto = _mapper.Map<HomeworkListResponseDto>(homework);

                dto.TotalStudents = homework.Class.Students.Count;
                dto.SubmittedCount = homework.Submissions
                    .Where(s => homework.Class.Students.Any(st => st.Oid == s.StudentOid))
                    .Select(s => s.StudentOid)
                    .Distinct()
                    .Count();

                return dto;
            }).ToList();

            return result;
        }
    }
}