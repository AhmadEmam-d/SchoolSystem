// Application/Features/Lessons/Queries/GetAll/GetAllLessonsQuery.cs
using MediatR;
using SchoolSystem.Application.Features.Lessons.DTOs;
using SchoolSystem.Domain.Enums;

namespace SchoolSystem.Application.Features.Lessons.Queries.GetAll
{
    public class GetAllLessonsQuery : IRequest<List<LessonResponseDto>>
    {
        public Guid? ClassOid { get; set; }
        public Guid? SubjectOid { get; set; }
        public Guid? TeacherOid { get; set; }
        public LessonStatus? Status { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string? SearchTerm { get; set; }
    }
}