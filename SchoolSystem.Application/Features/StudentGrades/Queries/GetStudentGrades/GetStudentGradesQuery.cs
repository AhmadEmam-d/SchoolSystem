using MediatR;
using SchoolSystem.Application.Features.StudentGrades.DTOs;
using System;

namespace SchoolSystem.Application.Features.StudentGrades.Queries.GetStudentGrades
{
    public class GetStudentGradesQuery : IRequest<StudentGradesDashboardDto>
    {
        public Guid StudentId { get; set; }

        public GetStudentGradesQuery(Guid studentId)
        {
            StudentId = studentId;
        }
    }
}