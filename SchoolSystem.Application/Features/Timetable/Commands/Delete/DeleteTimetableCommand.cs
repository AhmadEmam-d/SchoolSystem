using MediatR;
using System;

namespace SchoolSystem.Application.Features.Timetable.Commands.Delete
{
    public class DeleteTimetableCommand : IRequest<bool>
    {
        public Guid Oid { get; set; }

        public DeleteTimetableCommand(Guid oid)
        {
            Oid = oid;
        }
    }
}