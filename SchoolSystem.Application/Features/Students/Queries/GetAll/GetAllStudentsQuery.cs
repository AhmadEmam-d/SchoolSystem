using MediatR;
using SchoolSystem.Application.Features.Students.DTOs.Read;
using System.Collections.Generic;

public record GetAllStudentsQuery() : IRequest<List<StudentDto>>;
