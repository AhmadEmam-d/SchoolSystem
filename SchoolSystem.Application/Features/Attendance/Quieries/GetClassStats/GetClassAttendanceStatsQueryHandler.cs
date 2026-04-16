// Application/Features/Attendance/Queries/GetClassStats/GetClassAttendanceStatsQueryHandler.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Attendance.Queries.GetClassStats
{
    public class GetClassAttendanceStatsQueryHandler : IRequestHandler<GetClassAttendanceStatsQuery, ClassAttendanceStatsDto>
    {
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Attendance> _attendanceRepo;

        public GetClassAttendanceStatsQueryHandler(
            IGenericRepository<Student> studentRepo,
            IGenericRepository<SchoolSystem.Domain.Entities.Attendance> attendanceRepo)
        {
            _studentRepo = studentRepo;
            _attendanceRepo = attendanceRepo;
        }

        public async Task<ClassAttendanceStatsDto> Handle(GetClassAttendanceStatsQuery request, CancellationToken cancellationToken)
        {
            var students = await _studentRepo
                .GetAllQueryable()
                .Where(s => s.ClassOid == request.ClassOid && !s.IsDeleted)
                .ToListAsync(cancellationToken);

            var attendances = await _attendanceRepo
                .GetAllQueryable()
                .Where(a => a.ClassOid == request.ClassOid && !a.IsDeleted)
                .ToListAsync(cancellationToken);

            var totalPossibleAttendance = students.Count * attendances.Select(a => a.Date).Distinct().Count();
            var totalPresent = attendances.Count(a => a.Status == AttendanceStatus.Present);
            var averageAttendance = totalPossibleAttendance > 0 ? (double)totalPresent / totalPossibleAttendance * 100 : 0;

            var studentSummaries = new List<StudentAttendanceSummaryDto>();
            foreach (var student in students)
            {
                var studentAttendances = attendances.Where(a => a.StudentOid == student.Oid).ToList();
                var presentCount = studentAttendances.Count(a => a.Status == AttendanceStatus.Present);
                var totalDays = studentAttendances.Count;
                var percentage = totalDays > 0 ? (double)presentCount / totalDays * 100 : 0;

                studentSummaries.Add(new StudentAttendanceSummaryDto
                {
                    StudentOid = student.Oid,
                    StudentName = student.FullName,
                    AttendancePercentage = percentage,
                    PresentCount = presentCount,
                    AbsentCount = studentAttendances.Count(a => a.Status == AttendanceStatus.Absent),
                    LateCount = studentAttendances.Count(a => a.Status == AttendanceStatus.Late),
                    Status = percentage >= 90 ? "Good" : percentage >= 75 ? "Warning" : "Critical"
                });
            }

            return new ClassAttendanceStatsDto
            {
                AverageAttendance = averageAttendance,
                TotalLessons = attendances.Select(a => a.Date).Distinct().Count(),
                CompletedLessons = attendances.Select(a => a.Date).Distinct().Count(),
                StudentSummaries = studentSummaries.OrderByDescending(s => s.AttendancePercentage).ToList()
            };
        }
    }
}