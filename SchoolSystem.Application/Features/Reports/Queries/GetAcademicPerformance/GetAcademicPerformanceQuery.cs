using MediatR;
using SchoolSystem.Application.Features.Reports.DTOs;
using System;

namespace SchoolSystem.Application.Features.Reports.Queries.GetAcademicPerformance
{
    public class GetAcademicPerformanceQuery : IRequest<AcademicPerformanceDto>
    {
        public Guid? ClassOid { get; set; }
    }
}