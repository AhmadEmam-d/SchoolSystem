using MediatR;
using SchoolSystem.Application.Features.Reports.DTOs;
using System;

namespace SchoolSystem.Application.Features.Reports.Commands.GenerateStudentReport
{
    public class GenerateStudentReportCommand : IRequest<Guid>
    {
        public CreateStudentReportDto Dto { get; set; }
        public GenerateStudentReportCommand(CreateStudentReportDto dto) => Dto = dto;
    }
}