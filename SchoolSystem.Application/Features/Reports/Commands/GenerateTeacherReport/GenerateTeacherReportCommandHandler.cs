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

namespace SchoolSystem.Application.Features.Reports.Commands.GenerateTeacherReport
{
    public class GenerateTeacherReportCommandHandler : IRequestHandler<GenerateTeacherReportCommand, Guid>
    {
        private readonly IGenericRepository<TeacherReport> _teacherReportRepo;
        private readonly IGenericRepository<Teacher> _teacherRepo;
        private readonly IGenericRepository<Class> _classRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Attendance> _attendanceRepo;
        private readonly IGenericRepository<ExamResult> _examResultRepo;
        private readonly ICurrentUserService _currentUser;
        private readonly IMapper _mapper;

        public GenerateTeacherReportCommandHandler(
            IGenericRepository<TeacherReport> teacherReportRepo,
            IGenericRepository<Teacher> teacherRepo,
            IGenericRepository<Class> classRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<SchoolSystem.Domain.Entities.Attendance> attendanceRepo,
            IGenericRepository<ExamResult> examResultRepo,
            ICurrentUserService currentUser,
            IMapper mapper)
        {
            _teacherReportRepo = teacherReportRepo;
            _teacherRepo = teacherRepo;
            _classRepo = classRepo;
            _studentRepo = studentRepo;
            _attendanceRepo = attendanceRepo;
            _examResultRepo = examResultRepo;
            _currentUser = currentUser;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(GenerateTeacherReportCommand request, CancellationToken cancellationToken)
        {
            var teacher = await _teacherRepo.GetByOidAsync(request.Dto.TeacherOid);
            if (teacher == null)
                throw new Exception("Teacher not found");

            // Get classes taught by this teacher
            var classes = await _classRepo.GetAllQueryable()
                .Where(c => c.TeacherOid == request.Dto.TeacherOid)
                .ToListAsync(cancellationToken);

            var totalClasses = classes.Count;
            var totalStudents = await _studentRepo.GetAllQueryable()
                .Where(s => classes.Select(c => c.Oid).Contains(s.ClassOid))
                .CountAsync(cancellationToken);

            // Calculate average attendance
            var attendances = await _attendanceRepo.GetAllQueryable()
                .Where(a => classes.Select(c => c.Oid).Contains(a.ClassOid))
                .ToListAsync(cancellationToken);

            var avgAttendance = attendances.Any()
                ? attendances.Average(a => a.Status == AttendanceStatus.Present ? 100 : 0)
                : 0;

            // Calculate average grade
            var examResults = await _examResultRepo.GetAllQueryable()
                .Where(r => classes.Select(c => c.Oid).Contains(r.Exam.ClassOid))
                .ToListAsync(cancellationToken);

            var avgGrade = examResults.Any() ? examResults.Average(r => r.Percentage ?? 0) : 0;

            var teacherReport = new TeacherReport
            {
                TeacherOid = request.Dto.TeacherOid,
                ReportType = request.Dto.ReportType,
                TotalClasses = totalClasses,
                TotalStudents = totalStudents,
                AverageClassAttendance = Math.Round(avgAttendance, 1),
                AverageStudentGrade = Math.Round(avgGrade, 1),
                GeneratedAt = DateTime.UtcNow
            };

            await _teacherReportRepo.AddAsync(teacherReport);
            return teacherReport.Oid;
        }
    }
}