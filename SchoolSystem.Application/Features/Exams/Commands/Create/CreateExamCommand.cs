using MediatR;
using SchoolSystem.Application.Features.Exams.DTOs;

namespace SchoolSystem.Application.Features.Exams.Commands.Create
{
    public class CreateExamCommand : IRequest<Guid>
    {
        public CreateExamDto Dto { get; set; }
        public Guid TeacherId { get; set; }

        public CreateExamCommand(CreateExamDto dto, Guid teacherId)
        {
            Dto = dto;
            TeacherId = teacherId;
        }
    }
}