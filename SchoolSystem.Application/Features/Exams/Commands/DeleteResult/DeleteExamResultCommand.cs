using MediatR;
using System;

namespace SchoolSystem.Application.Features.Exams.Commands.DeleteResult
{
    public class DeleteExamResultCommand : IRequest<bool>
    {
        public Guid Oid { get; set; }

        public DeleteExamResultCommand(Guid oid)
        {
            Oid = oid;
        }
    }
}