using MediatR;
using SchoolSystem.Application.Features.Teachers.DTOs;
using SchoolSystem.Application.Features.Teachers.DTOs.Update;
using System;

namespace SchoolSystem.Application.Features.Teachers.Commands.Update
{
    public record UpdateTeacherCommand(Guid Oid, UpdateTeacherDto Teacher)
        : IRequest<UpdateTeacherCommandResponse>;
}