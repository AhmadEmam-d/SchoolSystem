using MediatR;
using SchoolSystem.Application.Features.Homeworks.DTOs;

namespace SchoolSystem.Application.Features.Homeworks.Queries.GetTeacherHomeworks
{
    public class GetTeacherHomeworksQuery : IRequest<List<HomeworkListResponseDto>>
    {
        public Guid TeacherId { get; set; }

        public GetTeacherHomeworksQuery(Guid teacherId)
        {
            TeacherId = teacherId;
        }
    }
}