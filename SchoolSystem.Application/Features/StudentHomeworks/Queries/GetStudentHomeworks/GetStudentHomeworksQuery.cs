using MediatR;
using SchoolSystem.Application.Features.StudentHomeworks.DTOs;
using System;

namespace SchoolSystem.Application.Features.StudentHomeworks.Queries.GetStudentHomeworks
{
    public class GetStudentHomeworksQuery : IRequest<StudentHomeworkDashboardDto>
    {
        public Guid StudentId { get; set; }
        public string? Status { get; set; } // Pending, Submitted, Graded, All
    }
}