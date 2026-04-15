using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Exams.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Exams.Queries.GetTeacherExams
{
    public class GetTeacherExamsQueryHandler : IRequestHandler<GetTeacherExamsQuery, List<ExamDto>>
    {
        private readonly IGenericRepository<Exam> _examRepo;
        private readonly IGenericRepository<Teacher> _teacherRepo;
        private readonly IMapper _mapper;

        public GetTeacherExamsQueryHandler(
            IGenericRepository<Exam> examRepo,
            IGenericRepository<Teacher> teacherRepo,
            IMapper mapper)
        {
            _examRepo = examRepo;
            _teacherRepo = teacherRepo;
            _mapper = mapper;
        }

        public async Task<List<ExamDto>> Handle(GetTeacherExamsQuery request, CancellationToken cancellationToken)
        {
            var teacher = await _teacherRepo
                .GetAllQueryable()
                .FirstOrDefaultAsync(t => t.UserId == request.TeacherId, cancellationToken);

            if (teacher == null)
                return new List<ExamDto>();

            var exams = await _examRepo
                .GetAllQueryable()
                .Include(e => e.Subject)
                .Include(e => e.Class)
                .Where(e => e.TeacherOid == teacher.Oid && !e.IsDeleted)
                .OrderByDescending(e => e.Date)
                .ToListAsync(cancellationToken);

            return _mapper.Map<List<ExamDto>>(exams);
        }
    }
}