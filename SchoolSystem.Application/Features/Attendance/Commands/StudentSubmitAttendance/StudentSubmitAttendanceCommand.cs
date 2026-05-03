// Application/Features/Attendance/Commands/StudentSubmitAttendance/StudentSubmitAttendanceCommand.cs
using MediatR;
using SchoolSystem.Application.Features.Attendance.DTOs;

namespace SchoolSystem.Application.Features.Attendance.Commands.StudentSubmitAttendance
{
    public class StudentSubmitAttendanceCommand : IRequest<StudentSubmitAttendanceResponseDto>
    {
        public StudentSubmitAttendanceDto Dto { get; set; }
        public Guid StudentId { get; set; }   // Extracted from JWT
    }
}