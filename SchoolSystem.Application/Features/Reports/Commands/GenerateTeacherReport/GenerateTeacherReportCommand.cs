using MediatR;
using SchoolSystem.Application.Features.Reports.DTOs;
using System;

namespace SchoolSystem.Application.Features.Reports.Commands.GenerateTeacherReport
{
    public class GenerateTeacherReportCommand : IRequest<Guid>
    {
        public CreateTeacherReportDto Dto { get; set; }

        public GenerateTeacherReportCommand(CreateTeacherReportDto dto)
        {
            Dto = dto;
        }
    }
}