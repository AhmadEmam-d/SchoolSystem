// Application/Features/Attendance/Commands/SubmitAttendanceSession/SubmitAttendanceSessionCommandHandler.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Attendance.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Attendance.Commands.SubmitAttendanceSession
{
    public class SubmitAttendanceSessionCommandHandler : IRequestHandler<SubmitAttendanceSessionCommand, bool>
    {
        private readonly IGenericRepository<AttendanceSession> _sessionRepo;
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Attendance> _attendanceRepo;

        public SubmitAttendanceSessionCommandHandler(
            IGenericRepository<AttendanceSession> sessionRepo,
            IGenericRepository<SchoolSystem.Domain.Entities.Attendance> attendanceRepo)
        {
            _sessionRepo = sessionRepo;
            _attendanceRepo = attendanceRepo;
        }

        public async Task<bool> Handle(SubmitAttendanceSessionCommand request, CancellationToken cancellationToken)
        {
            var session = await _sessionRepo.GetByOidAsync(request.Dto.SessionId);
            if (session == null)
                throw new Exception("Session not found");

            if (session.ExpiresAt < DateTime.UtcNow)
                throw new Exception("Session has expired");

            if (session.IsCompleted)
                throw new Exception("Session already completed");

            // التحقق من طريقة الأرقام
            if (session.Method == (int)AttendanceMethod.NumberSelection)
            {
                if (!request.Dto.SelectedNumber.HasValue)
                    throw new Exception("Please select a number");

                if (request.Dto.SelectedNumber.Value != session.CorrectNumber)
                    throw new Exception("Invalid number selected");
            }

            // تسجيل الحضور لكل طالب
            foreach (var attendance in request.Dto.Attendances)
            {
                var attendanceRecord = new SchoolSystem.Domain.Entities.Attendance
                {
                    Oid = Guid.NewGuid(),
                    StudentOid = attendance.StudentOid,
                    ClassOid = session.ClassOid,
                    Date = DateTime.UtcNow.Date,
                    Status = (AttendanceStatus)Enum.Parse(typeof(AttendanceStatus), attendance.Status),
                    Remarks = attendance.Remarks,
                    CreatedAt = DateTime.UtcNow
                };

                if (!string.IsNullOrEmpty(attendance.CheckInTime))
                    attendanceRecord.CheckInTime = TimeSpan.Parse(attendance.CheckInTime);

                await _attendanceRepo.AddAsync(attendanceRecord);
            }

            // تحديث حالة الجلسة
            session.IsCompleted = true;
            session.CompletedAt = DateTime.UtcNow;
            await _sessionRepo.UpdateAsync(session);

            return true;
        }
    }
}