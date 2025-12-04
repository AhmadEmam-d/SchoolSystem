using MediatR;
using SchoolSystem.Application.Features.Subjects.DTOs.Create;

public record CreateSubjectCommand(CreateSubjectDto Subject) : IRequest<Guid>;
