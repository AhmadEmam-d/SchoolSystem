// Application/Features/Reports/Queries/GetFinancialSummary/GetFinancialSummaryQuery.cs
using MediatR;
using SchoolSystem.Application.Features.Reports.DTOs;
using System;

namespace SchoolSystem.Application.Features.Reports.Queries.GetFinancialSummary
{
    public class GetFinancialSummaryQuery : IRequest<FinancialSummaryDto>
    {
        public int? Year { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}