using MediatR;
using SchoolSystem.Application.Features.Teachers.DTOs.Create.SchoolSystem.Application.Features.Teachers.DTOs.Create;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Teachers.Command.Create
{
    public record CreateTeacherCommand(CreateTeacherDto Teacher) : IRequest<Guid>;

}
