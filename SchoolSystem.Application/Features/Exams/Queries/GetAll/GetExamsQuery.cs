using MediatR;
using SchoolSystem.Application.Features.Exams.DTOs;
using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Exams.Queries.GetAll
{
    public class GetExamsQuery : IRequest<List<ExamDto>>
    {
        public Guid? SubjectOid { get; set; }
        public Guid? ClassOid { get; set; }
        public int? Status { get; set; }
        public int? Type { get; set; }
    }
}