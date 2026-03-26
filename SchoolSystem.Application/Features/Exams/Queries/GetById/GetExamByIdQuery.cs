using MediatR;
using SchoolSystem.Application.Features.Exams.DTOs;
using System;

namespace SchoolSystem.Application.Features.Exams.Queries.GetById
{
    public class GetExamByIdQuery : IRequest<ExamDto>
    {
        public Guid Oid { get; set; }

        public GetExamByIdQuery(Guid oid)
        {
            Oid = oid;
        }
    }
}