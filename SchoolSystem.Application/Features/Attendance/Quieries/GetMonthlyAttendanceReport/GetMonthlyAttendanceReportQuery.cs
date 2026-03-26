using MediatR;
using SchoolSystem.Application.Features.Attendance.DTOs;
using System;

namespace SchoolSystem.Application.Features.Attendance.Queries.GetMonthlyReport
{
    public class GetMonthlyAttendanceReportQuery : IRequest<MonthlyAttendanceReportDto>
    {
        public int? Year { get; set; }
        public int? Month { get; set; }
        public Guid? ClassOid { get; set; }
    }
}