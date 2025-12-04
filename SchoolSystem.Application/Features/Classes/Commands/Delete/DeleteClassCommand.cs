using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Classes.Commands.Delete
{
    public record DeleteClassCommand(Guid Id) : IRequest;

}
