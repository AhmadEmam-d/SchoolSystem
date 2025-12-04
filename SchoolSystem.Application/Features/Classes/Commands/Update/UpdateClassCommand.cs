using MediatR;
using SchoolSystem.Application.Features.Classes.DTOs.Update;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Classes.Commands.Update
{
    public record UpdateClassCommand(Guid Id, UpdateClassDto ClassDto) : IRequest;

}
