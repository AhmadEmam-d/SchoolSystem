using MediatR;
using SchoolSystem.Application.Features.Students.DTOs.Create;

public record CreateStudentCommand(CreateStudentDto Student) : IRequest<Guid>;
