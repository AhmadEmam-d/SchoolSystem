using MediatR;
using SchoolSystem.Application.Features.Students.DTOs;
using SchoolSystem.Application.Features.Students.DTOs.Update;
using System;

namespace SchoolSystem.Application.Features.Students.Commands.Update
{
    public record UpdateStudentCommand(Guid Oid, UpdateStudentDto Student)
        : IRequest<UpdateStudentCommandResponse>;
}