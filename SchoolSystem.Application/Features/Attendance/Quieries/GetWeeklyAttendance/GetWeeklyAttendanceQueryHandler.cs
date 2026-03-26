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

namespace SchoolSystem.Application.Features.Attendance.Queries.GetWeekly
{
    public class GetWeeklyAttendanceQueryHandler : IRequestHandler<GetWeeklyAttendanceQuery, WeeklyAttendanceDto>
    {
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Attendance> _attendanceRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IMapper _mapper;

        public GetWeeklyAttendanceQueryHandler(
            IGenericRepository<SchoolSystem.Domain.Entities.Attendance> attendanceRepo,
            IGenericRepository<Student> studentRepo,
            IMapper mapper)
        {
            _attendanceRepo = attendanceRepo;
            _studentRepo = studentRepo;
            _mapper = mapper;
        }

        public async Task<WeeklyAttendanceDto> Handle(GetWeeklyAttendanceQuery request, CancellationToken cancellationToken)
        {
            var endDate = DateTime.UtcNow.Date;
            var startDate = request.StartDate ?? endDate.AddDays(-6);

            var studentsQuery = _studentRepo.GetAllQueryable();
            if (request.ClassOid.HasValue)
                studentsQuery = studentsQuery.Where(s => s.ClassOid == request.ClassOid.Value);

            var totalStudents = await studentsQuery.CountAsync(cancellationToken);

            var attendances = await _attendanceRepo.GetAllQueryable()
                .Where(a => a.Date >= startDate && a.Date <= endDate)
                .ToListAsync(cancellationToken);

            if (request.ClassOid.HasValue)
                attendances = attendances.Where(a => a.ClassOid == request.ClassOid.Value).ToList();

            var dailyData = new List<DailyAttendanceDto>();
            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                var dayAttendances = attendances.Where(a => a.Date.Date == date).ToList();
                var present = dayAttendances.Count(a => a.Status == AttendanceStatus.Present);
                var absent = dayAttendances.Count(a => a.Status == AttendanceStatus.Absent);
                var late = dayAttendances.Count(a => a.Status == AttendanceStatus.Late);

                dailyData.Add(new DailyAttendanceDto
                {
                    Day = date.ToString("ddd"),
                    Date = date,
                    Present = present,
                    Absent = absent,
                    Late = late,
                    Total = totalStudents,
                    AttendanceRate = totalStudents > 0 ? (double)present / totalStudents * 100 : 0
                });
            }

            return new WeeklyAttendanceDto
            {
                DailyData = dailyData
            };
        }
    }
}