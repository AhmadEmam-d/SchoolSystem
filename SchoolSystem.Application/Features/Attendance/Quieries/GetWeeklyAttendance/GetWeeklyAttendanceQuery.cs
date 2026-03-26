using MediatR;
using SchoolSystem.Application.Features.Attendance.DTOs;
using System;

namespace SchoolSystem.Application.Features.Attendance.Queries.GetWeekly
{
    public class GetWeeklyAttendanceQuery : IRequest<WeeklyAttendanceDto>
    {
        public Guid? ClassOid { get; set; }
        public DateTime? StartDate { get; set; }
    }
}