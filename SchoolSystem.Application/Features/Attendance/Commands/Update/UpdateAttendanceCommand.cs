using MediatR;
using SchoolSystem.Application.Features.Attendance.DTOs;
using System;

namespace SchoolSystem.Application.Features.Attendance.Commands.Update
{
    public class UpdateAttendanceCommand : IRequest<bool>
    {
        public UpdateAttendanceDto Dto { get; set; }

        public UpdateAttendanceCommand(UpdateAttendanceDto dto)
        {
            Dto = dto;
        }
    }
}