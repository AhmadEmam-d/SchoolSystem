using MediatR;
using SchoolSystem.Application.Features.Reports.DTOs;

namespace SchoolSystem.Application.Features.Reports.Queries.GetFinancialSummary
{
    public class GetFinancialSummaryQuery : IRequest<FinancialSummaryDto>
    {
        public int? Year { get; set; }
    }
}