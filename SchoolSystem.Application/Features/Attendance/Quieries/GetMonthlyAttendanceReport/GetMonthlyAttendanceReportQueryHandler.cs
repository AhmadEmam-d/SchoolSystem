using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Attendance.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Attendance.Queries.GetMonthlyReport
{
    public class GetMonthlyAttendanceReportQueryHandler : IRequestHandler<GetMonthlyAttendanceReportQuery, MonthlyAttendanceReportDto>
    {
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Attendance> _attendanceRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IMapper _mapper;

        public GetMonthlyAttendanceReportQueryHandler(
            IGenericRepository<SchoolSystem.Domain.Entities.Attendance> attendanceRepo,
            IGenericRepository<Student> studentRepo,
            IMapper mapper)
        {
            _attendanceRepo = attendanceRepo;
            _studentRepo = studentRepo;
            _mapper = mapper;
        }

        public async Task<MonthlyAttendanceReportDto> Handle(GetMonthlyAttendanceReportQuery request, CancellationToken cancellationToken)
        {
            var year = request.Year ?? DateTime.UtcNow.Year;
            var month = request.Month ?? DateTime.UtcNow.Month;

            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.AddMonths(1).AddDays(-1);

            var schoolDays = Enumerable.Range(0, (endDate - startDate).Days + 1)
                .Select(offset => startDate.AddDays(offset))
                .Where(date => date.DayOfWeek != System.DayOfWeek.Friday && date.DayOfWeek != System.DayOfWeek.Saturday)
                .ToList();

            var studentsQuery = _studentRepo.GetAllQueryable();
            if (request.ClassOid.HasValue)
                studentsQuery = studentsQuery.Where(s => s.ClassOid == request.ClassOid.Value);

            var totalStudents = await studentsQuery.CountAsync(cancellationToken);

            var attendances = await _attendanceRepo.GetAllQueryable()
                .Where(a => a.Date >= startDate && a.Date <= endDate)
                .ToListAsync(cancellationToken);

            if (request.ClassOid.HasValue)
                attendances = attendances.Where(a => a.ClassOid == request.ClassOid.Value).ToList();

            var totalPresent = attendances.Count(a => a.Status == AttendanceStatus.Present);
            var totalAbsent = attendances.Count(a => a.Status == AttendanceStatus.Absent);
            var totalLate = attendances.Count(a => a.Status == AttendanceStatus.Late);

            var totalPossibleAttendance = totalStudents * schoolDays.Count;
            var attendanceRate = totalPossibleAttendance > 0 ? (double)totalPresent / totalPossibleAttendance * 100 : 0;

            var dailyData = new List<DailyAttendanceDto>();
            foreach (var date in schoolDays)
            {
                var dayAttendances = attendances.Where(a => a.Date.Date == date).ToList();
                var present = dayAttendances.Count(a => a.Status == AttendanceStatus.Present);

                dailyData.Add(new DailyAttendanceDto
                {
                    Day = date.ToString("dd/MM"),
                    Date = date,
                    Present = present,
                    Absent = dayAttendances.Count(a => a.Status == AttendanceStatus.Absent),
                    Late = dayAttendances.Count(a => a.Status == AttendanceStatus.Late),
                    Total = totalStudents,
                    AttendanceRate = totalStudents > 0 ? (double)present / totalStudents * 100 : 0
                });
            }

            return new MonthlyAttendanceReportDto
            {
                Year = year,
                Month = month,
                MonthName = startDate.ToString("MMMM"),
                AttendanceRate = attendanceRate,
                TotalAttendance = totalPresent,
                TotalAbsences = totalAbsent,
                LateArrivals = totalLate,
                TotalStudents = totalStudents,
                SchoolDays = schoolDays.Count,
                DailyData = dailyData
            };
        }
    }
}