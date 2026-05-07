using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Attendance.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Attendance.Commands.StudentSubmitAttendance
{
    public class StudentSubmitAttendanceCommandHandler
        : IRequestHandler<StudentSubmitAttendanceCommand, StudentSubmitAttendanceResponseDto>
    {
        private readonly IGenericRepository<AttendanceSession> _sessionRepo;
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Attendance> _attendanceRepo;
        private readonly IGenericRepository<Student> _studentRepo;

        public StudentSubmitAttendanceCommandHandler(
            IGenericRepository<AttendanceSession> sessionRepo,
            IGenericRepository<SchoolSystem.Domain.Entities.Attendance> attendanceRepo,
            IGenericRepository<Student> studentRepo)
        {
            _sessionRepo = sessionRepo;
            _attendanceRepo = attendanceRepo;
            _studentRepo = studentRepo;
        }

        public async Task<StudentSubmitAttendanceResponseDto> Handle(
            StudentSubmitAttendanceCommand request,
            CancellationToken cancellationToken)
        {
            var session = await _sessionRepo
                .GetAllQueryable()
                .FirstOrDefaultAsync(s => s.Oid == request.Dto.SessionId, cancellationToken);

            if (session == null)
                throw new Exception("Session not found.");

            if (session.IsCompleted)
                throw new Exception("This attendance session has already been completed.");

            if (DateTime.UtcNow > session.ExpiresAt)
                throw new Exception("This attendance session has expired.");

            var student = await _studentRepo
                .GetAllQueryable()
                .FirstOrDefaultAsync(
                    s => s.UserId == request.StudentId && s.ClassOid == session.ClassOid && !s.IsDeleted,
                    cancellationToken);

            if (student == null)
                throw new Exception("You are not enrolled in the class this session belongs to.");

            var alreadySubmitted = await _attendanceRepo
                 .GetAllQueryable()
                 .AnyAsync(
                            a => a.StudentOid == student.Oid && a.SessionOid == session.Oid,
                            cancellationToken);

            if (alreadySubmitted)
                throw new Exception("You have already submitted attendance for this session.");

            var method = (AttendanceMethod)session.Method;

            AttendanceStatus attendanceStatus = AttendanceStatus.Present;

            if (method == AttendanceMethod.NumberSelection)
            {
                if (request.Dto.SelectedNumber == null)
                    throw new Exception("You must provide the selected number for this session.");

                attendanceStatus = request.Dto.SelectedNumber == session.CorrectNumber
                    ? AttendanceStatus.Present
                    : AttendanceStatus.Absent;
            }

            if (method == AttendanceMethod.Manual)
                throw new Exception("Manual sessions are recorded by the teacher only.");

            var checkInTime = DateTime.UtcNow.TimeOfDay;
            var attendance = new SchoolSystem.Domain.Entities.Attendance
            {
                Oid = Guid.NewGuid(),
                StudentOid = student.Oid,
                ClassOid = session.ClassOid,
                SessionOid = session.Oid,  // Add this line
                Date = DateTime.UtcNow.Date,
                Status = attendanceStatus,
                Remarks = request.Dto.Remarks ?? $"Self-submitted via {method}",
                CheckInTime = checkInTime,
                CreatedAt = DateTime.UtcNow
            };

            await _attendanceRepo.AddAsync(attendance);

            return new StudentSubmitAttendanceResponseDto
            {
                Success = true,
                Status = attendanceStatus.ToString(),
                CheckInTime = checkInTime.ToString(@"hh\:mm"),
                Message = attendanceStatus == AttendanceStatus.Present
                    ? "Attendance recorded successfully."
                    : "Wrong number selected. Marked as Absent."
            };
        }
    }
}