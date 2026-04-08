// Application/Features/Lessons/Queries/GetStats/GetLessonStatsQuery.cs
using MediatR;
using SchoolSystem.Application.Features.Lessons.DTOs;

namespace SchoolSystem.Application.Features.Lessons.Queries.GetStats
{
    public class GetLessonStatsQuery : IRequest<LessonStatsDto>
    {
        public Guid? TeacherOid { get; set; }
        public Guid? ClassOid { get; set; }
    }
}