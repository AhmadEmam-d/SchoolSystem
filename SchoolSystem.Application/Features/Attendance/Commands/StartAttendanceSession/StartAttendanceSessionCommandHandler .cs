// Application/Features/Attendance/Commands/StartAttendanceSession/StartAttendanceSessionCommandHandler.cs
using MediatR;
using Microsoft.EntityFrameworkCore;
using QRCoder;
using SchoolSystem.Application.Features.Attendance.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Attendance.Commands.StartAttendanceSession
{
    public class StartAttendanceSessionCommandHandler : IRequestHandler<StartAttendanceSessionCommand, AttendanceSessionResponseDto>
    {
        private readonly IGenericRepository<AttendanceSession> _sessionRepo;
        private readonly IGenericRepository<Class> _classRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<Lesson> _lessonRepo;

        public StartAttendanceSessionCommandHandler(
            IGenericRepository<AttendanceSession> sessionRepo,
            IGenericRepository<Class> classRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<Lesson> lessonRepo)
        {
            _sessionRepo = sessionRepo;
            _classRepo = classRepo;
            _studentRepo = studentRepo;
            _lessonRepo = lessonRepo;
        }

        public async Task<AttendanceSessionResponseDto> Handle(StartAttendanceSessionCommand request, CancellationToken cancellationToken)
        {
            var classEntity = await _classRepo.GetByOidAsync(request.Dto.ClassOid);
            if (classEntity == null)
                throw new Exception("Class not found");
            var lesson = await _lessonRepo.GetByOidAsync(request.Dto.LessonOid);
            if (lesson == null)
                throw new Exception("Lesson not found");
            var students = await _studentRepo
                .GetAllQueryable()
                .Where(s => s.ClassOid == request.Dto.ClassOid && !s.IsDeleted)
                .Select(s => new StudentInfoDto
                {
                    StudentOid = s.Oid,
                    StudentName = s.FullName
                })
                .ToListAsync(cancellationToken);

            var sessionId = Guid.NewGuid();
            var response = new AttendanceSessionResponseDto
            {
                SessionId = sessionId,
                ClassOid = request.Dto.ClassOid,
                LessonOid = request.Dto.LessonOid,
                LessonName = lesson.Title,
                ClassName = classEntity.Name,
                Method = request.Dto.Method,
                Students = students,
                ExpiresAt = DateTime.UtcNow.AddMinutes(30)
            };

            // حسب الطريقة المختارة
            if (request.Dto.Method == AttendanceMethod.QRCode)
            {
                response.QrCodeBase64 = GenerateQRCode(sessionId.ToString());
            }
            else if (request.Dto.Method == AttendanceMethod.NumberSelection)
            {
                var correctNum = request.Dto.CorrectNumber!.Value; // e.g. 7
                var random = new Random();
                var numbers = new List<int> { correctNum };

                // Generate 2 unique wrong numbers
                while (numbers.Count < 3)
                {
                    var num = random.Next(1, 101); // wider range looks better
                    if (!numbers.Contains(num))
                        numbers.Add(num);
                }

                // Shuffle so correct number isn't always first
                response.RandomNumbers = numbers.OrderBy(_ => random.Next()).ToList();
            }

            // حفظ الجلسة في قاعدة البيانات
            // حفظ الجلسة في قاعدة البيانات
            var session = new AttendanceSession
            {
                Oid = sessionId,
                ClassOid = request.Dto.ClassOid,
                TeacherId = request.TeacherId,
                Method = (int)request.Dto.Method,
                StartTime = DateTime.UtcNow,
                ExpiresAt = response.ExpiresAt,
                CorrectNumber = request.Dto.Method == AttendanceMethod.NumberSelection
                        ? request.Dto.CorrectNumber   // ✅ Teacher's chosen number
                        : null,

                // ✅ FIX: save QR code so students can retrieve it
                QrCode = request.Dto.Method == AttendanceMethod.QRCode
                    ? response.QrCodeBase64
                    : null,

                // ✅ FIX: save all random numbers as JSON so students see all 3 options
                RandomNumbersJson = request.Dto.Method == AttendanceMethod.NumberSelection
                    ? System.Text.Json.JsonSerializer.Serialize(response.RandomNumbers)
                    : null,

                CreatedAt = DateTime.UtcNow
            };
            await _sessionRepo.AddAsync(session);

            return response;
        }

        private string GenerateQRCode(string text)
        {
            using (var qrGenerator = new QRCodeGenerator())
            {
                var qrCodeData = qrGenerator.CreateQrCode(text, QRCodeGenerator.ECCLevel.Q);
                var qrCode = new PngByteQRCode(qrCodeData);
                var qrCodeBytes = qrCode.GetGraphic(20);
                return Convert.ToBase64String(qrCodeBytes);
            }
        }
    }
}