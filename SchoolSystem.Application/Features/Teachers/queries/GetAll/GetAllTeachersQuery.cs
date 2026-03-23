using MediatR;
using SchoolSystem.Application.Features.Teachers.DTOs;

namespace SchoolSystem.Application.Features.Teachers.Query.GetAll
{
    public class GetAllTeachersQuery : IRequest<List<TeacherResponseDto>>
    {
    }
}
