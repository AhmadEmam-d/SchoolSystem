using MediatR;
using SchoolSystem.Application.Features.Exams.DTOs;
using System;

namespace SchoolSystem.Application.Features.Exams.Commands.Create
{
    public class CreateExamCommand : IRequest<Guid>
    {
        public CreateExamDto Dto { get; set; }

        public CreateExamCommand(CreateExamDto dto)
        {
            Dto = dto;
        }
    }
}