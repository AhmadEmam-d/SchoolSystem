using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Attendance.DTOs;
using SchoolSystem.Application.Features.Attendance.Queries.GetActiveSession;
using SchoolSystem.Application.Features.Attendance.Quieries.GetActiveSession;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Attendance.Queries.GetActiveSession
{
    public class GetActiveSessionForStudentQueryHandler
        : IRequestHandler<GetActiveSessionForStudentQuery, ActiveSessionDto>
    {
        private readonly IGenericRepository<AttendanceSession> _sessionRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<Class> _classRepo;

        public GetActiveSessionForStudentQueryHandler(
            IGenericRepository<AttendanceSession> sessionRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<Class> classRepo)
        {
            _sessionRepo = sessionRepo;
            _studentRepo = studentRepo;
            _classRepo = classRepo;
        }

        public async Task<ActiveSessionDto> Handle(
            GetActiveSessionForStudentQuery request,
            CancellationToken cancellationToken)
        {
            // Find which class this student is in
            var student = await _studentRepo
                .GetAllQueryable()
                .FirstOrDefaultAsync(s => s.UserId == request.StudentId && !s.IsDeleted, cancellationToken);

            if (student == null)
                throw new Exception("Student not found.");

            // Find a non-expired, non-completed session for their class
            var session = await _sessionRepo
                .GetAllQueryable()
                .Where(s => s.ClassOid == student.ClassOid
                         && !s.IsCompleted
                         && s.ExpiresAt > DateTime.UtcNow)
                .OrderByDescending(s => s.StartTime)
                .FirstOrDefaultAsync(cancellationToken);

            if (session == null)
                throw new Exception("No active attendance session found for your class.");

            var classEntity = await _classRepo.GetByOidAsync(session.ClassOid);

            // For NumberSelection: re-derive the numbers from CorrectNumber stored
            // (only the correct one is stored — return all 3 options from QrCode field
            //  or store them; simplest approach: return null and let teacher display them)
            return new ActiveSessionDto
            {
                SessionId = session.Oid,
                ClassName = classEntity?.Name ?? "Unknown",
                Method = (AttendanceMethod)session.Method,
                QrCodeBase64 = session.Method == (int)AttendanceMethod.QRCode
                    ? session.QrCode
                    : null,

                // ✅ FIX: deserialize the stored numbers back into a list
                RandomNumbers = session.Method == (int)AttendanceMethod.NumberSelection
                        && session.RandomNumbersJson != null
                    ? System.Text.Json.JsonSerializer.Deserialize<List<int>>(session.RandomNumbersJson)
                    : null,

                ExpiresAt = session.ExpiresAt
            };
        }
    }
}