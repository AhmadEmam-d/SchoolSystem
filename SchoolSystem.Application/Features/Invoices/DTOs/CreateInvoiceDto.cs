// Application/Features/Invoices/DTOs/CreateInvoiceDto.cs
using System;

namespace SchoolSystem.Application.Features.Invoices.DTOs
{
    public class CreateInvoiceDto
    {
        public Guid StudentId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime DueDate { get; set; }
        public string? Notes { get; set; }
    }

    public class BulkCreateInvoicesDto
    {
        public List<Guid> StudentIds { get; set; } = new();
        public string Title { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime DueDate { get; set; }
        public string? Notes { get; set; }
    }

    public class GenerateMonthlyFeesDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public List<Guid>? ClassIds { get; set; } // Optional: specific classes
        public decimal BaseAmount { get; set; } = 1200;
    }

    public class UpdateInvoiceDto
    {
        public Guid InvoiceId { get; set; }
        public decimal? Amount { get; set; }
        public DateTime? DueDate { get; set; }
        public string? Notes { get; set; }
        public int? Status { get; set; }
    }
}