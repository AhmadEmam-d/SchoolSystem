using MediatR;
using System;

namespace SchoolSystem.Application.Features.Reports.Commands.DeleteReport
{
    public class DeleteReportCommand : IRequest<bool>
    {
        public Guid Oid { get; set; }

        public DeleteReportCommand(Guid oid)
        {
            Oid = oid;
        }
    }
}