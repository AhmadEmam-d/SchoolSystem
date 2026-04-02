using MediatR;
using SchoolSystem.Application.Features.Reports.DTOs;
using System;

namespace SchoolSystem.Application.Features.Reports.Queries.GetAttendanceDistribution
{
    public class GetAttendanceDistributionQuery : IRequest<AttendanceDistributionDto>
    {
        public Guid? ClassOid { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}