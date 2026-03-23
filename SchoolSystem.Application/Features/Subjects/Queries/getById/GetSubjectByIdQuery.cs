using MediatR;
using SchoolSystem.Application.Features.Subjects.DTOs;

public record GetSubjectByIdQuery(Guid Oid) : IRequest<SubjectResponseDto>;
