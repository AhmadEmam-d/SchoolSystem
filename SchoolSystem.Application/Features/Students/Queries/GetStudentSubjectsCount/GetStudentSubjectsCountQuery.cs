using MediatR;
using SchoolSystem.Application.Features.Students.DTOs.Read;
using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Students.Queries.GetStudentSubjectsCount
{
    public class GetStudentSubjectsCountQuery : IRequest<List<StudentSubjectsCountDto>>
    {
        public Guid? StudentId { get; set; }
        public Guid? ClassId { get; set; }

        public GetStudentSubjectsCountQuery(Guid? studentId = null, Guid? classId = null)
        {
            StudentId = studentId;
            ClassId = classId;
        }
    }
}