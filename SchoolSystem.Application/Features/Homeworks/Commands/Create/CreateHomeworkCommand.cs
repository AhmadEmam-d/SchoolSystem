using MediatR;
using SchoolSystem.Application.Features.Homeworks.DTOs;

namespace SchoolSystem.Application.Features.Homeworks.Commands.Create
{
    public class CreateHomeworkCommand : IRequest<Guid>
    {
        public CreateHomeworkDto Dto { get; set; }
        public Guid TeacherId { get; set; }

        public CreateHomeworkCommand(CreateHomeworkDto dto, Guid teacherId)
        {
            Dto = dto;
            TeacherId = teacherId;
        }
    }
}