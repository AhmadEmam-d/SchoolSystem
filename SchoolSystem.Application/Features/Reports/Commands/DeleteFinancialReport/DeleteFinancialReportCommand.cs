using MediatR;
using System;

namespace SchoolSystem.Application.Features.Reports.Commands.DeleteFinancialReport
{
    public class DeleteFinancialReportCommand : IRequest<bool>
    {
        public Guid Oid { get; set; }

        public DeleteFinancialReportCommand(Guid oid)
        {
            Oid = oid;
        }
    }
}