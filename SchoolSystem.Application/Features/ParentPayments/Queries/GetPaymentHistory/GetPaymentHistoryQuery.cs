// Application/Features/ParentPayments/Queries/GetPaymentHistory/GetParentPaymentHistoryQuery.cs
using MediatR;
using SchoolSystem.Application.Features.ParentPayments.DTOs.Read;
using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.ParentPayments.Queries.GetPaymentHistory
{
    public class GetParentPaymentHistoryQuery : IRequest<List<ParentPaymentHistoryDto>>
    {
        public Guid? StudentId { get; set; }
        public string? Category { get; set; }
        public string? Status { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}