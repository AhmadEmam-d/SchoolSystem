using MediatR;
using SchoolSystem.Application.Features.Attendance.DTOs;
using SchoolSystem.Application.Features.Parents.DTOs;
using System;

namespace SchoolSystem.Application.Features.Parents.Queries.GetParentAttendance
{
    public class GetParentAttendanceQuery : IRequest<ParentFullDashboardDto>
    {
        public Guid ParentOid { get; set; }
    }
}