using AutoMapper;
using MediatR;
using SchoolSystem.Application.Features.Attendance.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Attendance.Commands.Create
{
    public class CreateAttendanceCommandHandler : IRequestHandler<CreateAttendanceCommand, Guid>
    {
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Attendance> _attendanceRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<Class> _classRepo;
        private readonly IMapper _mapper;

        public CreateAttendanceCommandHandler(
            IGenericRepository<SchoolSystem.Domain.Entities.Attendance> attendanceRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<Class> classRepo,
            IMapper mapper)
        {
            _attendanceRepo = attendanceRepo;
            _studentRepo = studentRepo;
            _classRepo = classRepo;
            _mapper = mapper;
        }

        // Application/Features/Attendance/Commands/Create/CreateAttendanceCommandHandler.cs
        // Application/Features/Attendance/Commands/Create/CreateAttendanceCommandHandler.cs
        public async Task<Guid> Handle(CreateAttendanceCommand request, CancellationToken cancellationToken)
        {
            var classEntity = await _classRepo.GetByOidAsync(request.Dto.ClassOid);
            if (classEntity == null)
                throw new Exception("Class not found");

            var attendanceRecords = new List<SchoolSystem.Domain.Entities.Attendance>();

            foreach (var studentAttendance in request.Dto.Attendances)
            {
                var student = await _studentRepo.GetByOidAsync(studentAttendance.StudentOid);
                if (student == null) continue;

                var attendance = new SchoolSystem.Domain.Entities.Attendance
                {
                    Oid = Guid.NewGuid(),
                    StudentOid = studentAttendance.StudentOid,
                    ClassOid = request.Dto.ClassOid,
                    Date = request.Dto.Date,
                    Status = (AttendanceStatus)Enum.Parse(typeof(AttendanceStatus), studentAttendance.Status),
                    Remarks = studentAttendance.Remarks,
                    CreatedAt = DateTime.UtcNow
                };

                if (!string.IsNullOrEmpty(studentAttendance.CheckInTime))
                    attendance.CheckInTime = TimeSpan.Parse(studentAttendance.CheckInTime);

                attendanceRecords.Add(attendance);
            }

            foreach (var attendance in attendanceRecords)
            {
                await _attendanceRepo.AddAsync(attendance);
            }

            return request.Dto.ClassOid;
        }
    }
}