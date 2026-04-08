using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Lessons.Commands.Delete
{
    public class DeleteLessonCommand : IRequest<bool>
    {
        public Guid Oid { get; set; }

        public DeleteLessonCommand(Guid oid)
        {
            Oid = oid;
        }
    }
}
