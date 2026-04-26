using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Parents.DTOs;
using SchoolSystem.Application.Features.StudentGrades.Queries.GetStudentGrades; 
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Parents.Queries.GetParentAttendance
{
    public class GetParentAttendanceQueryHandler : IRequestHandler<GetParentAttendanceQuery, ParentFullDashboardDto>
    {
        private readonly IGenericRepository<Domain.Entities.Attendance> _attendanceRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<User> _userRepo;
        private readonly IMediator _mediator; // لإرسال GetStudentGradesQuery

        public GetParentAttendanceQueryHandler(
            IGenericRepository<Domain.Entities.Attendance> attendanceRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<User> userRepo,
            IMediator mediator)
        {
            _attendanceRepo = attendanceRepo;
            _studentRepo = studentRepo;
            _userRepo = userRepo;
            _mediator = mediator;
        }

        public async Task<ParentFullDashboardDto> Handle(GetParentAttendanceQuery request, CancellationToken cancellationToken)
        {
            var parentUser = await _userRepo.GetByOidAsync(request.ParentOid);

            var students = await _studentRepo.GetAllQueryable()
                .Include(s => s.Class)
                .Where(s => s.ParentOid == request.ParentOid || s.Parent.UserId == request.ParentOid)
                .ToListAsync(cancellationToken);

            var response = new ParentFullDashboardDto
            {
                ParentName = parentUser?.FullName ?? "N/A",
                Children = new List<StudentDashboardDetailDto>()
            };

            foreach (var student in students)
            {
                // 1. جلب سجلات الحضور
                var records = await _attendanceRepo.GetAllQueryable()
                    .Where(a => a.StudentOid == student.Oid)
                    .ToListAsync(cancellationToken);

                // 2. جلب بيانات الدرجات (تعريف المتغيرات المفقودة في صورتك)
                var gradesQuery = new GetStudentGradesQuery(student.Oid);
                var gradesData = await _mediator.Send(gradesQuery, cancellationToken);

                // --- حل خطأ CS0103 بتعريف المتغيرات هنا ---
                double gpaValue = gradesData?.OverallGPA?.GPA ?? 0.0;
                int subjectsCountValue = gradesData?.SubjectPerformance?.Subjects?.Count ?? 0;

                int present = records.Count(a => a.Status == AttendanceStatus.Present);
                int total = records.Count;
                double attendancePerc = total > 0 ? (double)present / total * 100 : 0;

                response.Children.Add(new StudentDashboardDetailDto
                {
                    StudentOid = student.Oid,
                    StudentName = student.FullName,
                    GradeLevel = GetGradeLevelFromClass(student.Class),
                    GPA = Math.Round(gpaValue, 1),
                    Attendance = Math.Round(attendancePerc, 0),
                    SubjectsCount = subjectsCountValue,
                    AttendanceStats = new ParentAttendanceDashboardDto
                    {
                        OverallAttendancePercentage = Math.Round(attendancePerc, 1),
                        TotalPresentDays = present,
                        TotalAbsentDays = records.Count(a => a.Status == AttendanceStatus.Absent),
                        TotalLateDays = records.Count(a => a.Status == AttendanceStatus.Late),
                        RecentRecords = records.OrderByDescending(x => x.Date)
                            .Take(5)
                            .Select(a => new AttendanceHistoryDto
                            {
                                Date = a.Date,
                                DayName = a.Date.DayOfWeek.ToString(), // سيتم حل CS0200 بتعديل الـ DTO
                                Status = a.Status.ToString()
                            }).ToList()
                    }
                });
            }
            return response;
        }
        

        // --- أضف هاتين الميثودين قبل القوس الأخير في الكلاس ---
        private string GetGradeLevelFromClass(Class studentClass)
        {
            if (studentClass == null) return "N/A";
            var words = (studentClass.Name ?? "").Split(' ', '-', '_');
            foreach (var word in words)
            {
                if (word.Contains("th") && int.TryParse(word.Replace("th", ""), out int g)) return $"{g}{GetOrdinal(g)}";
                if (int.TryParse(word, out int gn) && gn >= 1 && gn <= 12) return $"{gn}{GetOrdinal(gn)}";
            }
            return studentClass.Name ?? "N/A";
        }

        private string GetOrdinal(int n) => (n % 100) switch { 11 or 12 or 13 => "th", _ => (n % 10) switch { 1 => "st", 2 => "nd", 3 => "rd", _ => "th" } };
    }
}