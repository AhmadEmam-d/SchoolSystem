using AutoMapper;
using MediatR;
using SchoolSystem.Application.Features.Attendance.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Attendance.Commands.Update
{
    public class UpdateAttendanceCommandHandler : IRequestHandler<UpdateAttendanceCommand, bool>
    {
        private readonly IGenericRepository<SchoolSystem.Domain.Entities.Attendance> _attendanceRepo;
        private readonly IMapper _mapper;

        public UpdateAttendanceCommandHandler(
            IGenericRepository<SchoolSystem.Domain.Entities.Attendance> attendanceRepo,
            IMapper mapper)
        {
            _attendanceRepo = attendanceRepo;
            _mapper = mapper;
        }

        public async Task<bool> Handle(UpdateAttendanceCommand request, CancellationToken cancellationToken)
        {
            var attendance = await _attendanceRepo.GetByOidAsync(request.Dto.Oid);
            if (attendance == null)
                throw new Exception("Attendance record not found");

            attendance.Status = (AttendanceStatus)Enum.Parse(typeof(AttendanceStatus), request.Dto.Status);
            attendance.Remarks = request.Dto.Remarks;

            if (!string.IsNullOrEmpty(request.Dto.CheckInTime))
                attendance.CheckInTime = TimeSpan.Parse(request.Dto.CheckInTime);

            if (!string.IsNullOrEmpty(request.Dto.CheckOutTime))
                attendance.CheckOutTime = TimeSpan.Parse(request.Dto.CheckOutTime);

            await _attendanceRepo.UpdateAsync(attendance);
            return true;
        }
    }
}