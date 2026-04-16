using MediatR;
using SchoolSystem.Application.Features.Students.DTOs.Create;

namespace SchoolSystem.Application.Features.Students.Commands.Create
{
    public class CreateStudentCommand : IRequest<Guid>
    {
        public CreateStudentDto Student { get; set; }

        public CreateStudentCommand(CreateStudentDto student)
        {
            Student = student;
        }
    }
}