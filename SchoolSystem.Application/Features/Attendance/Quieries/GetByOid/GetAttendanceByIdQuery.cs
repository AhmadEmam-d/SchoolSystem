using MediatR;
using SchoolSystem.Application.Features.Attendance.DTOs;
using System;

namespace SchoolSystem.Application.Features.Attendance.Queries.GetById
{
    public class GetAttendanceByIdQuery : IRequest<AttendanceDto>
    {
        public Guid Oid { get; set; }

        public GetAttendanceByIdQuery(Guid oid)
        {
            Oid = oid;
        }
    }
}