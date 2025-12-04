using System;
using System.Collections.Generic;
using System.Text;
using MediatR;

namespace SchoolSystem.Application.Features.Parents.Commands.Delete
{
    public record DeleteParentCommand(Guid Id) : IRequest;

}
