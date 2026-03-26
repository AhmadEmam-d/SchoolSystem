using MediatR;
using SchoolSystem.Application.Features.Attendance.DTOs;
using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Attendance.Queries.GetAll
{
    public class GetAllAttendancesQuery : IRequest<List<AttendanceDto>>
    {
        public Guid? ClassOid { get; set; }
        public DateTime? Date { get; set; }
    }
}