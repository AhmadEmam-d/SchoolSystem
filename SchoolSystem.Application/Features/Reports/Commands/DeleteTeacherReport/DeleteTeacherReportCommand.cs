using MediatR;
using System;

namespace SchoolSystem.Application.Features.Reports.Commands.DeleteTeacherReport
{
    public class DeleteTeacherReportCommand : IRequest<bool>
    {
        public Guid Oid { get; set; }

        public DeleteTeacherReportCommand(Guid oid)
        {
            Oid = oid;
        }
    }
}