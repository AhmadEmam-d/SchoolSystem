// Application/Features/Lessons/Queries/GetAll/GetAllLessonsQueryHandler.cs
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Lessons.DTOs;
using SchoolSystem.Application.Features.Lessons.Queries.GetAll;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Lessons.Queries.GetAll
{
    public class GetAllLessonsQueryHandler : IRequestHandler<GetAllLessonsQuery, List<LessonResponseDto>>
    {
        private readonly IGenericRepository<Lesson> _lessonRepo;
        private readonly IMapper _mapper;

        public GetAllLessonsQueryHandler(IGenericRepository<Lesson> lessonRepo, IMapper mapper)
        {
            _lessonRepo = lessonRepo;
            _mapper = mapper;
        }

        public async Task<List<LessonResponseDto>> Handle(GetAllLessonsQuery request, CancellationToken cancellationToken)
        {
            var query = _lessonRepo
                .GetAllQueryable()
                .Include(l => l.Class)
                .Include(l => l.Subject)
                .Include(l => l.Teacher)
                .Include(l => l.Teacher.User)
                .Include(l => l.Objectives)
                .Include(l => l.Materials)
                .Include(l => l.Homeworks)
                .Where(l => !l.IsDeleted);

            // Apply filters
            if (request.ClassOid.HasValue)
                query = query.Where(l => l.ClassOid == request.ClassOid);

            if (request.SubjectOid.HasValue)
                query = query.Where(l => l.SubjectOid == request.SubjectOid);

            if (request.TeacherOid.HasValue)
                query = query.Where(l => l.TeacherOid == request.TeacherOid);

            if (request.Status.HasValue)
                query = query.Where(l => l.Status == request.Status);

            if (request.FromDate.HasValue)
                query = query.Where(l => l.Date >= request.FromDate);

            if (request.ToDate.HasValue)
                query = query.Where(l => l.Date <= request.ToDate);

            if (!string.IsNullOrEmpty(request.SearchTerm))
                query = query.Where(l => l.Title.Contains(request.SearchTerm) ||
                                         l.Description.Contains(request.SearchTerm));

            var lessons = await query
                .OrderByDescending(l => l.Date)
                .ThenBy(l => l.StartTime)
                .ToListAsync(cancellationToken);

            return _mapper.Map<List<LessonResponseDto>>(lessons);
        }
    }
}