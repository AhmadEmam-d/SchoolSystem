using MediatR;
using SchoolSystem.Application.Features.Attendance.DTOs;
using System;

namespace SchoolSystem.Application.Features.Attendance.Queries.GetToday
{
    public class GetTodayAttendanceQuery : IRequest<TodayAttendanceDto>
    {
        public Guid? ClassOid { get; set; }
    }
}