using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Attendance.DTOs;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Attendance.Queries.GetParentAttendancequery
{
    public class GetParentAttendanceQueryHandler : IRequestHandler<GetParentAttendanceQuery, ParentAttendanceDashboardDto>
    {
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Attendance> _attendanceRepo;

        public GetParentAttendanceQueryHandler(IGenericRepository<SchoolSystem.Domain.Entities.Attendance> attendanceRepo)
        {
            _attendanceRepo = attendanceRepo;
        }

        public async Task<ParentAttendanceDashboardDto> Handle(GetParentAttendanceQuery request, CancellationToken cancellationToken)
        {
            var records = await _attendanceRepo.GetAllQueryable()
                .Where(a => a.StudentOid == request.StudentOid)
                .OrderByDescending(a => a.Date)
                .ToListAsync(cancellationToken);

            if (records == null || !records.Any())
                return new ParentAttendanceDashboardDto();

            var total = records.Count;
            var presentCount = records.Count(a => a.Status == AttendanceStatus.Present);

            var dashboard = new ParentAttendanceDashboardDto
            {
                OverallAttendancePercentage = total > 0 ? Math.Round(((double)presentCount / total) * 100, 1) : 0,
                TotalPresentDays = presentCount,
                TotalAbsentDays = records.Count(a => a.Status == AttendanceStatus.Absent),
                TotalLateDays = records.Count(a => a.Status == AttendanceStatus.Late),

                RecentRecords = records.Take(5).Select(a => new AttendanceHistoryDto
                {
                    Date = a.Date,
                    Status = a.Status.ToString(),
                }).ToList(),

                MonthlyTrend = records.GroupBy(a => new { a.Date.Year, a.Date.Month })
                    .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
                    .Select(g => new AttendanceChartItemDto
                    {
                        Month = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM"),
                        Percentage = Math.Round(((double)g.Count(x => x.Status == AttendanceStatus.Present) / g.Count()) * 100, 1)
                    }).ToList()
            };

            if (dashboard.OverallAttendancePercentage < 90)
                dashboard.WarningMessage = "Attendance is below 90% threshold.";

            return dashboard;
        }
    }
}