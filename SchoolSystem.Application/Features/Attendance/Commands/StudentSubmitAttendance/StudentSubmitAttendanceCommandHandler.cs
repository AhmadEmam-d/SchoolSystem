// Application/Features/Attendance/Commands/StudentSubmitAttendance/StudentSubmitAttendanceCommandHandler.cs
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
            // 1. Load and validate session
            var session = await _sessionRepo
                .GetAllQueryable()
                .FirstOrDefaultAsync(s => s.Oid == request.Dto.SessionId, cancellationToken);

            if (session == null)
                throw new Exception("Session not found.");

            if (session.IsCompleted)
                throw new Exception("This attendance session has already been completed.");

            if (DateTime.UtcNow > session.ExpiresAt)
                throw new Exception("This attendance session has expired.");

            // 2. Verify the student belongs to this class
            var student = await _studentRepo
                .GetAllQueryable()
                .FirstOrDefaultAsync(
                    s => s.UserId == request.StudentId && s.ClassOid == session.ClassOid && !s.IsDeleted,
                    cancellationToken);

            if (student == null)
                throw new Exception("You are not enrolled in the class this session belongs to.");

            // 3. Prevent duplicate submission
            var alreadySubmitted = await _attendanceRepo
                .GetAllQueryable()
                .AnyAsync(
                    a => a.StudentOid == student.Oid
                      && a.Date.Date == DateTime.UtcNow.Date
                      && a.ClassOid == session.ClassOid,
                    cancellationToken);

            if (alreadySubmitted)
                throw new Exception("You have already submitted attendance for this session.");

            // 4. Method-specific validation
            var method = (AttendanceMethod)session.Method;

            if (method == AttendanceMethod.NumberSelection)
            {
                if (request.Dto.SelectedNumber == null)
                    throw new Exception("You must provide the selected number for this session.");

                if (request.Dto.SelectedNumber != session.CorrectNumber)
                    throw new Exception("Incorrect number selected. Please try again.");
            }
            // QRCode: scanning provides the correct sessionId — no extra validation needed.
            // Manual: students cannot self-submit for manual sessions.
            if (method == AttendanceMethod.Manual)
                throw new Exception("Manual sessions are recorded by the teacher only.");

            // 5. Record attendance
            var checkInTime = DateTime.UtcNow.TimeOfDay;
            var attendance = new SchoolSystem.Domain.Entities.Attendance
            {
                Oid = Guid.NewGuid(),
                StudentOid = student.Oid,
                ClassOid = session.ClassOid,
                Date = DateTime.UtcNow.Date,
                Status = AttendanceStatus.Present,
                Remarks = request.Dto.Remarks ?? $"Self-submitted via {method}",
                CheckInTime = checkInTime,
                CreatedAt = DateTime.UtcNow
            };

            await _attendanceRepo.AddAsync(attendance);

            return new StudentSubmitAttendanceResponseDto
            {
                Success = true,
                Status = "Present",
                CheckInTime = checkInTime.ToString(@"hh\:mm"),
                Message = "Attendance recorded successfully."
            };
        }
    }
}