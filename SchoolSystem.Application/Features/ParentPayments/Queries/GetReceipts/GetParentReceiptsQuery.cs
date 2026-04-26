// Application/Features/ParentPayments/Queries/GetReceipts/GetParentReceiptsQuery.cs
using MediatR;
using SchoolSystem.Application.Features.ParentPayments.DTOs.Read;
using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.ParentPayments.Queries.GetReceipts
{
    public class GetParentReceiptsQuery : IRequest<List<ParentReceiptDto>>
    {
        public Guid? StudentId { get; set; }
        public string? Category { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}