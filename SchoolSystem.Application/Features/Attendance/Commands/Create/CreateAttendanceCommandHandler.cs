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

        public async Task<Guid> Handle(CreateAttendanceCommand request, CancellationToken cancellationToken)
        {
            var student = await _studentRepo.GetByOidAsync(request.Dto.StudentOid);
            if (student == null)
                throw new Exception("Student not found");

            var classEntity = await _classRepo.GetByOidAsync(request.Dto.ClassOid);
            if (classEntity == null)
                throw new Exception("Class not found");

            var attendance = new SchoolSystem.Domain.Entities.Attendance
            {
                StudentOid = request.Dto.StudentOid,
                ClassOid = request.Dto.ClassOid,
                Date = request.Dto.Date,
                Status = (AttendanceStatus)Enum.Parse(typeof(AttendanceStatus), request.Dto.Status),
                Remarks = request.Dto.Remarks
            };

            if (!string.IsNullOrEmpty(request.Dto.CheckInTime))
                attendance.CheckInTime = TimeSpan.Parse(request.Dto.CheckInTime);

            if (!string.IsNullOrEmpty(request.Dto.CheckOutTime))
                attendance.CheckOutTime = TimeSpan.Parse(request.Dto.CheckOutTime);

            await _attendanceRepo.AddAsync(attendance);
            return attendance.Oid;
        }
    }
}