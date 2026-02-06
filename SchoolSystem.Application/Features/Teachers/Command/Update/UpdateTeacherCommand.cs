using MediatR;
using SchoolSystem.Application.Features.Teachers.DTOs.Update;
using SchoolSystem.Application.Features.Teachers.DTOs.Update.SchoolSystem.Application.Features.Teachers.DTOs.Update;
using System;

namespace SchoolSystem.Application.Features.Teachers.Command.Update
{
    public record UpdateTeacherCommand(UpdateTeacherDto Teacher) : IRequest<Unit>;
}
