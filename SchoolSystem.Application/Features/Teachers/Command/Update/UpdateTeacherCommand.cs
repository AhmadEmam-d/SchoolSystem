using MediatR;
using SchoolSystem.Application.Features.Teachers.DTOs.Update.SchoolSystem.Application.Features.Teachers.DTOs.Update;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Teachers.Command.Update
{
    public record UpdateTeacherCommand(Guid Id, UpdateTeacherDto Teacher) : IRequest;

}
