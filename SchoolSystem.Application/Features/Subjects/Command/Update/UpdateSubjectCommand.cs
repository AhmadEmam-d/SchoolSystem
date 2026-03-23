using MediatR;
using SchoolSystem.Application.Features.Subjects.DTOs;
using SchoolSystem.Application.Features.Subjects.DTOs.Update.SchoolSystem.Application.Features.Subjects.DTOs.Update;
using System;

namespace SchoolSystem.Application.Features.Subjects.Commands.Update
{
    public record UpdateSubjectCommand(Guid Oid, UpdateSubjectDto Subject) : IRequest<UpdateSubjectCommandResponse>;
}