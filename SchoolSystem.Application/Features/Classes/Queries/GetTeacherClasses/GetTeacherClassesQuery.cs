using MediatR;
using SchoolSystem.Application.Features.Classes.DTOs.Read;

namespace SchoolSystem.Application.Features.Classes.Queries.GetTeacherClasses
{
    public class GetTeacherClassesQuery : IRequest<List<ClassResponseDto>>
    {
        public Guid TeacherId { get; set; }

        public GetTeacherClassesQuery(Guid teacherId)
        {
            TeacherId = teacherId;
        }
    }
}