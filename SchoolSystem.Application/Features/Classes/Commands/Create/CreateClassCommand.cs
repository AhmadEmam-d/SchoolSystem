using MediatR;
using SchoolSystem.Application.Features.Classes.DTOs.Create;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Classes.Commands.Create
{
    public record CreateClassCommand(CreateClassDto ClassDto) : IRequest<Guid>;

}
