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

            var classes = await _classRepo.GetAllQueryable()
                .Where(c => c.TeacherOid == request.Dto.TeacherOid)
                .ToListAsync(cancellationToken);

            var classOids = classes.Select(c => c.Oid).ToList();

            var totalStudents = await _studentRepo.GetAllQueryable()
                .Where(s => classOids.Contains(s.ClassOid))
                .CountAsync(cancellationToken);

            var attendances = await _attendanceRepo.GetAllQueryable()
                .Where(a => classOids.Contains(a.ClassOid))
                .ToListAsync(cancellationToken);

            var avgAttendance = attendances.Any()
                ? attendances.Average(a => a.Status == AttendanceStatus.Present ? 100 : 0)
                : 0;

            var examResults = await _examResultRepo.GetAllQueryable()
                .Include(r => r.Exam)
                .Where(r => r.Exam != null && classOids.Contains(r.Exam.ClassOid))
                .ToListAsync(cancellationToken);

            var avgGrade = examResults.Any()
                ? examResults.Average(r => r.Percentage ?? 0)
                : 0;

            var teacherReport = _mapper.Map<TeacherReport>(request.Dto);
            teacherReport.TotalClasses = classes.Count;
            teacherReport.TotalStudents = totalStudents;
            teacherReport.AverageClassAttendance = Math.Round(avgAttendance, 1);
            teacherReport.AverageStudentGrade = Math.Round(avgGrade, 1);
            teacherReport.GeneratedAt = DateTime.UtcNow;

            await _teacherReportRepo.AddAsync(teacherReport);
            return teacherReport.Oid;
        }
    }
}