using MediatR;
using SchoolSystem.Application.Features.Students.DTOs.Read;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Students.Queries.GetAllStudentsWithSubjectsCount
{
    public class GetAllStudentsWithSubjectsCountQuery : IRequest<List<StudentSubjectsCountDto>>
    {
        public Guid? ClassId { get; set; } // Optional filter by class
    }
}