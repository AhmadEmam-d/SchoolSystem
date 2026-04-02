using MediatR;
using System;

namespace SchoolSystem.Application.Features.Reports.Commands.ArchiveReport
{
    public class ArchiveReportCommand : IRequest<bool>
    {
        public Guid Oid { get; set; }

        public ArchiveReportCommand(Guid oid)
        {
            Oid = oid;
        }
    }
}