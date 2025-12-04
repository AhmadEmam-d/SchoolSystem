using MediatR;
using SchoolSystem.Application.Features.Students.DTOs.Read;

public record GetStudentByIdQuery(Guid Id) : IRequest<StudentDto>;
