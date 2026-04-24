using MediatR;
using SchoolSystem.Application.Features.Attendance.DTOs;
using System;

namespace SchoolSystem.Application.Features.Attendance.Queries.GetParentAttendancequery
{
    public class GetParentAttendanceQuery : IRequest<ParentAttendanceDashboardDto>
    {
        public Guid StudentOid { get; set; }
    }
}