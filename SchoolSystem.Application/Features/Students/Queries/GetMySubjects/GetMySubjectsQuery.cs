using MediatR;
using SchoolSystem.Application.Features.Students.DTOs.Read;
using System;

namespace SchoolSystem.Application.Features.Students.Queries.GetMySubjects
{
    public class GetMySubjectsQuery : IRequest<MySubjectsDto>
    {
        public Guid StudentId { get; set; }  // Changed from UserId to StudentId

        public GetMySubjectsQuery(Guid studentId)
        {
            StudentId = studentId;
        }
    }
}