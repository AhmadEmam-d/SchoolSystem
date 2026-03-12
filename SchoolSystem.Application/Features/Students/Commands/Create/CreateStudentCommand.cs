using MediatR;
using SchoolSystem.Application.Features.Students.DTOs.Create;

namespace SchoolSystem.Application.Features.Students.Commands.Create
{
    public record CreateStudentCommand(CreateStudentDto Student) : IRequest<CreateStudentCommandResponse>;
}