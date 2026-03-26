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

namespace SchoolSystem.Application.Features.Attendance.Queries.GetToday
{
    public class GetTodayAttendanceQueryHandler : IRequestHandler<GetTodayAttendanceQuery, TodayAttendanceDto>
    {
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Attendance> _attendanceRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IMapper _mapper;

        public GetTodayAttendanceQueryHandler(
            IGenericRepository<SchoolSystem.Domain.Entities.Attendance> attendanceRepo,
            IGenericRepository<Student> studentRepo,
            IMapper mapper)
        {
            _attendanceRepo = attendanceRepo;
            _studentRepo = studentRepo;
            _mapper = mapper;
        }

        public async Task<TodayAttendanceDto> Handle(GetTodayAttendanceQuery request, CancellationToken cancellationToken)
        {
            var today = DateTime.UtcNow.Date;

            var studentsQuery = _studentRepo.GetAllQueryable();
            if (request.ClassOid.HasValue)
                studentsQuery = studentsQuery.Where(s => s.ClassOid == request.ClassOid.Value);

            var totalStudents = await studentsQuery.CountAsync(cancellationToken);

            var attendances = await _attendanceRepo.GetAllQueryable()
                .Include(a => a.Student)
                .ThenInclude(s => s.Class)
                .Where(a => a.Date.Date == today)
                .ToListAsync(cancellationToken);

            if (request.ClassOid.HasValue)
                attendances = attendances.Where(a => a.ClassOid == request.ClassOid.Value).ToList();

            var presentCount = attendances.Count(a => a.Status == AttendanceStatus.Present);
            var absentCount = attendances.Count(a => a.Status == AttendanceStatus.Absent);
            var lateCount = attendances.Count(a => a.Status == AttendanceStatus.Late);

            var recentAbsentees = attendances
                .Where(a => a.Status == AttendanceStatus.Absent)
                .Take(5)
                .Select(a => new StudentAttendanceDto
                {
                    StudentOid = a.StudentOid,
                    StudentName = a.Student.FullName,
                    ClassName = a.Student.Class?.Name ?? "N/A",
                    Status = a.Status.ToString()
                })
                .ToList();

            return new TodayAttendanceDto
            {
                PresentCount = presentCount,
                AbsentCount = absentCount,
                LateCount = lateCount,
                TotalStudents = totalStudents,
                PresentPercentage = totalStudents > 0 ? (double)presentCount / totalStudents * 100 : 0,
                RecentAbsentees = recentAbsentees
            };
        }
    }
}