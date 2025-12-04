using MediatR;
using SchoolSystem.Application.Features.Students.DTOs.Update;

public record UpdateStudentCommand(Guid Id, UpdateStudentDto Student) : IRequest<Unit>;
