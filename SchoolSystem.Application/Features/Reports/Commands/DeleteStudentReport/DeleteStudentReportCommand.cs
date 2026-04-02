using MediatR;
using System;

namespace SchoolSystem.Application.Features.Reports.Commands.DeleteStudentReport
{
    public class DeleteStudentReportCommand : IRequest<bool>
    {
        public Guid Oid { get; set; }

        public DeleteStudentReportCommand(Guid oid)
        {
            Oid = oid;
        }
    }
}