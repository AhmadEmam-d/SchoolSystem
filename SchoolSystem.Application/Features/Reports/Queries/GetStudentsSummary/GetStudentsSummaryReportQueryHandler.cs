using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Reports.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Reports.Queries.GetStudentsSummary
{
    public class GetStudentsSummaryReportQueryHandler : IRequestHandler<GetStudentsSummaryReportQuery, StudentsSummaryReportDto>
    {
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Attendance> _attendanceRepo;
        private readonly IGenericRepository<ExamResult> _examResultRepo;
        private readonly IMapper _mapper;

        public GetStudentsSummaryReportQueryHandler(
            IGenericRepository<Student> studentRepo,
            IGenericRepository<SchoolSystem.Domain.Entities.Attendance> attendanceRepo,
            IGenericRepository<ExamResult> examResultRepo,
            IMapper mapper)
        {
            _studentRepo = studentRepo;
            _attendanceRepo = attendanceRepo;
            _examResultRepo = examResultRepo;
            _mapper = mapper;
        }

        public async Task<StudentsSummaryReportDto> Handle(GetStudentsSummaryReportQuery request, CancellationToken cancellationToken)
        {
            // ✅ الطريقة الأولى: جلب البيانات أولاً ثم المعالجة
            var allStudents = await _studentRepo.GetAllQueryable().ToListAsync(cancellationToken);
            var students = allStudents.ToList();

            if (request.ClassOid.HasValue)
                students = students.Where(s => s.ClassOid == request.ClassOid.Value).ToList();

            var totalStudents = students.Count;
            var activeStudents = students.Count;
            var activePercentage = totalStudents > 0 ? (double)activeStudents / totalStudents * 100 : 0;

            var studentOids = students.Select(s => s.Oid).ToList();

            var allAttendances = await _attendanceRepo.GetAllQueryable().ToListAsync(cancellationToken);
            var attendances = allAttendances.Where(a => studentOids.Contains(a.StudentOid)).ToList();

            var avgAttendance = attendances.Any()
                ? attendances.Average(a => a.Status == AttendanceStatus.Present ? 100 : 0)
                : 0;

            var allExamResults = await _examResultRepo.GetAllQueryable().ToListAsync(cancellationToken);
            var examResults = allExamResults.Where(r => studentOids.Contains(r.StudentOid)).ToList();

            var avgPerformance = examResults.Any() ? examResults.Average(r => r.Percentage ?? 0) : 0;

            var genderDistribution = new GenderDistributionDto
            {
                Male = students.Count(s => s.Gender == "Male"),
                Female = students.Count(s => s.Gender == "Female")
            };

            var classDistribution = students
                .GroupBy(s => s.Class?.Name ?? "Unknown")
                .Select(g => new ClassDistributionDto { ClassName = g.Key, StudentCount = g.Count() })
                .ToList();

            var statusDistribution = new StatusDistributionDto
            {
                Active = students.Count(),
                Inactive = 0,
                Graduated = 0
            };

            var studentList = students.Select(s => new StudentReportItemDto
            {
                Oid = s.Oid,
                FullName = s.FullName,
                ClassName = s.Class?.Name ?? "N/A",
                Gender = s.Gender,
                Status = "Active",
                Attendance = GetStudentAttendance(s.Oid, attendances),
                Performance = GetStudentPerformance(s.Oid, examResults),
                EnrollmentDate = s.CreatedAt
            }).ToList();

            return new StudentsSummaryReportDto
            {
                TotalStudents = totalStudents,
                ActiveStudents = activeStudents,
                ActivePercentage = Math.Round(activePercentage, 1),
                AvgAttendance = Math.Round(avgAttendance, 1),
                AvgPerformance = Math.Round(avgPerformance, 1),
                AttendanceChange = 5.0,
                PerformanceChange = 2.0,
                TotalStudentsChange = 8.0,
                GenderDistribution = genderDistribution,
                ClassDistribution = classDistribution,
                StatusDistribution = statusDistribution,
                Students = studentList
            };
        }

        private double GetStudentAttendance(Guid studentOid, List<SchoolSystem.Domain.Entities.Attendance> attendances)
        {
            var studentAttendances = attendances.Where(a => a.StudentOid == studentOid).ToList();
            if (!studentAttendances.Any()) return 0;
            var presentCount = studentAttendances.Count(a => a.Status == AttendanceStatus.Present);
            return Math.Round((double)presentCount / studentAttendances.Count * 100, 1);
        }

        private double GetStudentPerformance(Guid studentOid, List<ExamResult> examResults)
        {
            var studentResults = examResults.Where(r => r.StudentOid == studentOid).ToList();
            if (!studentResults.Any()) return 0;
            return Math.Round(studentResults.Average(r => r.Percentage ?? 0), 1);
        }
    }
}