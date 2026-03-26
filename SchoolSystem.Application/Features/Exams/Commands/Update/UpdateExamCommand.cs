using MediatR;
using SchoolSystem.Application.Features.Exams.DTOs;
using System;

namespace SchoolSystem.Application.Features.Exams.Commands.Update
{
    public class UpdateExamCommand : IRequest<bool>
    {
        public UpdateExamDto Dto { get; set; }

        public UpdateExamCommand(UpdateExamDto dto)
        {
            Dto = dto;
        }
    }
}