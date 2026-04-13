using MediatR;
using SchoolSystem.Application.Features.Homeworks.DTOs.Get;

namespace SchoolSystem.Application.Features.Homeworks.Queries.Get
{
    public record GetTeacherHomeworksQuery(Guid TeacherId)
        : IRequest<List<HomeworkListDto>>;
}