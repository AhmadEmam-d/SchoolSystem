// Application/Features/ParentPayments/DTOs/Create/ParentMakePaymentDto.cs
using System;

namespace SchoolSystem.Application.Features.ParentPayments.DTOs.Create
{
    public class ParentMakePaymentDto
    {
        public Guid InvoiceId { get; set; }
        public Guid StudentId { get; set; }
        public decimal Amount { get; set; }

        public string CardNumber { get; set; } = string.Empty;
        public string ExpiryDate { get; set; } = string.Empty;
        public string Cvv { get; set; } = string.Empty;
        public string CardholderName { get; set; } = string.Empty;

        public string? Email { get; set; }
        public string? Phone { get; set; }
    }
}