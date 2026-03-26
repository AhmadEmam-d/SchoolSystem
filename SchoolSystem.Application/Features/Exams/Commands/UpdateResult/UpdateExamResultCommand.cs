using MediatR;
using SchoolSystem.Application.Features.Exams.DTOs;
using System;

namespace SchoolSystem.Application.Features.Exams.Commands.UpdateResult
{
    public class UpdateExamResultCommand : IRequest<bool>
    {
        public UpdateExamResultDto Dto { get; set; }

        public UpdateExamResultCommand(UpdateExamResultDto dto)
        {
            Dto = dto;
        }
    }
}