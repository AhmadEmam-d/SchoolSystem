// Application/Features/ParentPayments/DTOs/Read/ParentPaymentSummaryDto.cs
using System;

namespace SchoolSystem.Application.Features.ParentPayments.DTOs.Read
{
    public class ParentPaymentSummaryDto
    {
        public decimal TotalPaid { get; set; }
        public decimal TotalPending { get; set; }
        public decimal TotalOverdue { get; set; }
        public decimal TotalDue { get; set; }
        public int OverdueCount { get; set; }
        public decimal OverdueAmount { get; set; }
        public int TotalChildren { get; set; }
        public int TotalInvoices { get; set; }
        public bool HasOverduePayments { get; set; }
        public decimal MinimumPaymentDue { get; set; }
    }
    public class ParentPaymentHistoryDto
    {
        public Guid InvoiceId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal RemainingAmount { get; set; }
        public DateTime DueDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? PaidDate { get; set; }
        public string? ReceiptNumber { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public Guid StudentId { get; set; }
        public bool CanPay { get; set; }
        public bool IsOverdue { get; set; }
        public int DaysOverdue { get; set; }
    }
    public class ParentReceiptDto
    {
        public string ReceiptNumber { get; set; } = string.Empty;
        public string InvoiceNumber { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public string? CardLastFour { get; set; }
        public string? TransactionId { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}