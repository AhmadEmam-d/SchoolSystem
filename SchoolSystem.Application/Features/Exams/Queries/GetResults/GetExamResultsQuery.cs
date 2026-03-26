using MediatR;
using SchoolSystem.Application.Features.Exams.DTOs;
using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Exams.Queries.GetResults
{
    public class GetExamResultsQuery : IRequest<List<ExamResultDto>>
    {
        public Guid ExamOid { get; set; }

        public GetExamResultsQuery(Guid examOid)
        {
            ExamOid = examOid;
        }
    }
}