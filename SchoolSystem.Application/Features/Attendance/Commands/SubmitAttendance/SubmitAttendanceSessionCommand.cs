using MediatR;
using SchoolSystem.Application.Features.Attendance.DTOs;

namespace SchoolSystem.Application.Features.Attendance.Commands.SubmitAttendanceSession
{
    public class SubmitAttendanceSessionCommand : IRequest<bool>
    {
        public SubmitAttendanceSessionDto Dto { get; set; }
        public Guid TeacherId { get; set; }
    }
}