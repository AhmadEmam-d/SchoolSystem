using MediatR;
using SchoolSystem.Application.Features.Reports.DTOs;
using System;

namespace SchoolSystem.Application.Features.Reports.Queries.GetGradesReport
{
    public class GetGradesReportQuery : IRequest<GradesReportDto>
    {
        public Guid? ClassOid { get; set; }
        public Guid? SubjectOid { get; set; }
    }
}