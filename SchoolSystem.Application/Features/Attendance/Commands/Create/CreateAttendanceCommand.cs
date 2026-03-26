using MediatR;
using SchoolSystem.Application.Features.Attendance.DTOs;
using System;

namespace SchoolSystem.Application.Features.Attendance.Commands.Create
{
    public class CreateAttendanceCommand : IRequest<Guid>
    {
        public CreateAttendanceDto Dto { get; set; }

        public CreateAttendanceCommand(CreateAttendanceDto dto)
        {
            Dto = dto;
        }
    }
}