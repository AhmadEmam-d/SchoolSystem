using MediatR;
using SchoolSystem.Application.Features.Exams.DTOs;
using System;

namespace SchoolSystem.Application.Features.Exams.Commands.CreateResult
{
    public class CreateExamResultCommand : IRequest<Guid>
    {
        public CreateExamResultDto Dto { get; set; }

        public CreateExamResultCommand(CreateExamResultDto dto)
        {
            Dto = dto;
        }
    }
}