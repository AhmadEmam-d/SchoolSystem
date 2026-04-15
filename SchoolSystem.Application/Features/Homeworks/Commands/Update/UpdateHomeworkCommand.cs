// Application/Features/Homeworks/Commands/Update/UpdateHomeworkCommand.cs
using MediatR;
using SchoolSystem.Application.Features.Homeworks.DTOs.Update;

namespace SchoolSystem.Application.Features.Homeworks.Commands.Update
{
    public class UpdateHomeworkCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
        public UpdateHomeworkDto Dto { get; set; }

        public UpdateHomeworkCommand(Guid id, UpdateHomeworkDto dto)
        {
            Id = id;
            Dto = dto;
        }
    }
}