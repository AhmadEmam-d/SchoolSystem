using MediatR;
using SchoolSystem.Application.Features.Subjects.DTOs.Update;
using SchoolSystem.Application.Features.Subjects.DTOs.Update.SchoolSystem.Application.Features.Subjects.DTOs.Update;

public record UpdateSubjectCommand(Guid Id, UpdateSubjectDto Subject) : IRequest;
