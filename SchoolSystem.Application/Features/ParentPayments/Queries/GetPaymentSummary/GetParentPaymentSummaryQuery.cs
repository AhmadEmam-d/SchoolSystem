// Application/Features/ParentPayments/Queries/GetPaymentSummary/GetParentPaymentSummaryQuery.cs
using MediatR;
using SchoolSystem.Application.Features.ParentPayments.DTOs.Read;
using System;

namespace SchoolSystem.Application.Features.ParentPayments.Queries.GetPaymentSummary
{
    public class GetParentPaymentSummaryQuery : IRequest<ParentPaymentSummaryDto>
    {
    }
}