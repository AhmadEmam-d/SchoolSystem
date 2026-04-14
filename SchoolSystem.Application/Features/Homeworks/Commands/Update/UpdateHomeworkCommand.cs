using MediatR;
using SchoolSystem.Application.Features.Homeworks.DTOs.Response;
using SchoolSystem.Application.Features.Homeworks.DTOs.Update;

namespace SchoolSystem.Application.Features.Homeworks.Commands.Update
{
    public class UpdateHomeworkCommand : IRequest<HomeworkDetailResponseDto>
    {
        public Guid Oid { get; set; }
        public UpdateHomeworkDto Homework { get; set; }

        public UpdateHomeworkCommand(Guid oid, UpdateHomeworkDto homework)
        {
            Oid = oid;
            Homework = homework;
        }
    }
}