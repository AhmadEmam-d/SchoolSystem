using MediatR;
using System;

namespace SchoolSystem.Application.Features.Attendance.Commands.Delete
{
    public class DeleteAttendanceCommand : IRequest<bool>
    {
        public Guid Oid { get; set; }

        public DeleteAttendanceCommand(Guid oid)
        {
            Oid = oid;
        }
    }
}