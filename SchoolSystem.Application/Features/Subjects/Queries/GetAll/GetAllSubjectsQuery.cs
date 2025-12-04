using MediatR;
using SchoolSystem.Application.Features.Subjects.DTOs;
using System.Collections.Generic;

public record GetAllSubjectsQuery() : IRequest<List<SubjectResponseDto>>;
