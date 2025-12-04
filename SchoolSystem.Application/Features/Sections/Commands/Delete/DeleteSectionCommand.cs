using System;
using System.Collections.Generic;
using System.Text;
using MediatR;

namespace SchoolSystem.Application.Features.Sections.Commands.Delete
{

    public record DeleteSectionCommand(Guid Id) : IRequest;

}
