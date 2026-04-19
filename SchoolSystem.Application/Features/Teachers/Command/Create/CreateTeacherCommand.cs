using MediatR;
using SchoolSystem.Application.Features.Teachers.DTOs.Create;

namespace SchoolSystem.Application.Features.Teachers.Commands.Create
{
    public class CreateTeacherCommand : IRequest<Guid>
    {
        public CreateTeacherDto Teacher { get; set; }
    }
}