using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Reports.DTOs;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Reports.Commands.GenerateStudentReport
{
    public class GenerateStudentReportCommandHandler : IRequestHandler<GenerateStudentReportCommand, Guid>
    {
        private readonly IGenericRepository<StudentReport> _studentReportRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Attendance> _attendanceRepo;
        private readonly IGenericRepository<ExamResult> _examResultRepo;
        private readonly ICurrentUserService _currentUser;
        private readonly IMapper _mapper;

        public GenerateStudentReportCommandHandler(
            IGenericRepository<StudentReport> studentReportRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<SchoolSystem.Domain.Entities.Attendance> attendanceRepo,
            IGenericRepository<ExamResult> examResultRepo,
            ICurrentUserService currentUser,
            IMapper mapper)
        {
            _studentReportRepo = studentReportRepo;
            _studentRepo = studentRepo;
            _attendanceRepo = attendanceRepo;
            _examResultRepo = examResultRepo;
            _currentUser = currentUser;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(GenerateStudentReportCommand request, CancellationToken cancellationToken)
        {
            var student = await _studentRepo.GetByOidAsync(request.Dto.StudentOid);
            if (student == null) throw new Exception("Student not found");

            // ✅ تحديد النوع صراحة في ToListAsync
            var attendances = await _attendanceRepo.GetAllQueryable()
                .Where(a => a.StudentOid == request.Dto.StudentOid)
                .ToListAsync<SchoolSystem.Domain.Entities.Attendance>(cancellationToken);

            var attendanceRate = attendances.Any()
                ? (double)attendances.Count(a => a.Status == AttendanceStatus.Present) / attendances.Count * 100
                : 0;

            // ✅ تحديد النوع صراحة في ToListAsync
            var examResults = await _examResultRepo.GetAllQueryable()
                .Where(r => r.StudentOid == request.Dto.StudentOid)
                .ToListAsync<ExamResult>(cancellationToken);

            var averageGrade = examResults.Any() ? examResults.Average(r => r.Percentage ?? 0) : 0;
            var totalExams = examResults.Count;
            var passedExams = examResults.Count(r => r.IsPassed);
            var failedExams = totalExams - passedExams;

            var studentReport = new StudentReport
            {
                StudentOid = request.Dto.StudentOid,
                ReportType = request.Dto.ReportType,
                AttendanceRate = Math.Round(attendanceRate, 1),
                AverageGrade = Math.Round(averageGrade, 1),
                TotalExams = totalExams,
                PassedExams = passedExams,
                FailedExams = failedExams,
                GeneratedAt = DateTime.UtcNow
            };

            await _studentReportRepo.AddAsync(studentReport);
            return studentReport.Oid;
        }
    }
}