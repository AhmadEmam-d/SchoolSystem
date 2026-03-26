using MediatR;
using System;

namespace SchoolSystem.Application.Features.Exams.Commands.Delete
{
    public class DeleteExamCommand : IRequest<bool>
    {
        public Guid Oid { get; set; }

        public DeleteExamCommand(Guid oid)
        {
            Oid = oid;
        }
    }
}