// Application/Features/Lessons/Queries/GetStats/GetLessonStatsQueryHandler.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Lessons.DTOs;
using SchoolSystem.Application.Features.Lessons.Queries.GetStats;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Lessons.Queries.GetStats
{
    public class GetLessonStatsQueryHandler : IRequestHandler<GetLessonStatsQuery, LessonStatsDto>
    {
        private readonly IGenericRepository<Lesson> _lessonRepo;
        private readonly IGenericRepository<LessonMaterial> _materialRepo;

        public GetLessonStatsQueryHandler(
            IGenericRepository<Lesson> lessonRepo,
            IGenericRepository<LessonMaterial> materialRepo)
        {
            _lessonRepo = lessonRepo;
            _materialRepo = materialRepo;
        }

        public async Task<LessonStatsDto> Handle(GetLessonStatsQuery request, CancellationToken cancellationToken)
        {
            var query = _lessonRepo.GetAllQueryable().Where(l => !l.IsDeleted);

            if (request.TeacherOid.HasValue)
                query = query.Where(l => l.TeacherOid == request.TeacherOid);

            if (request.ClassOid.HasValue)
                query = query.Where(l => l.ClassOid == request.ClassOid);

            var now = DateTime.Now;
            var startOfWeek = now.AddDays(-(int)now.DayOfWeek);
            var startOfMonth = new DateTime(now.Year, now.Month, 1);

            var lessons = await query.ToListAsync(cancellationToken);
            var materials = await _materialRepo.GetAllQueryable()
                .Where(m => !m.IsDeleted)
                .ToListAsync(cancellationToken);

            return new LessonStatsDto
            {
                TotalLessons = lessons.Count,
                CompletedLessons = lessons.Count(l => l.Status == LessonStatus.Completed),
                UpcomingLessons = lessons.Count(l => l.Status == LessonStatus.Upcoming),
                TotalMaterials = materials.Count,
                ThisWeekLessons = lessons.Count(l => l.Date >= startOfWeek && l.Date <= now),
                ThisMonthLessons = lessons.Count(l => l.Date >= startOfMonth && l.Date <= now)
            };
        }
    }
}