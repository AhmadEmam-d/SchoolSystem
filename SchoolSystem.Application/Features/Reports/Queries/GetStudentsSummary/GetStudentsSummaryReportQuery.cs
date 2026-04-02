using MediatR;
using SchoolSystem.Application.Features.Reports.DTOs;
using System;

namespace SchoolSystem.Application.Features.Reports.Queries.GetStudentsSummary
{
    public class GetStudentsSummaryReportQuery : IRequest<StudentsSummaryReportDto>
    {
        public Guid? ClassOid { get; set; }
        public string? Status { get; set; }
    }
}