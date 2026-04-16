using MediatR;
using SchoolSystem.Application.Features.Attendance.DTOs;

namespace SchoolSystem.Application.Features.Attendance.Commands.StartAttendanceSession
{
    public class StartAttendanceSessionCommand : IRequest<AttendanceSessionResponseDto>
    {
        public StartAttendanceSessionDto Dto { get; set; }
        public Guid TeacherId { get; set; }
    }
}