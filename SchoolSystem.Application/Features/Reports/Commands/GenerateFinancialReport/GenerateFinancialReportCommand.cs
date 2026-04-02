using MediatR;
using SchoolSystem.Application.Features.Reports.DTOs;
using System;

namespace SchoolSystem.Application.Features.Reports.Commands.GenerateFinancialReport
{
    public class GenerateFinancialReportCommand : IRequest<Guid>
    {
        public CreateFinancialReportDto Dto { get; set; }

        public GenerateFinancialReportCommand(CreateFinancialReportDto dto)
        {
            Dto = dto;
        }
    }
}