// Domain/Entities/FeeInvoice.cs
using SchoolSystem.Domain.Common;
using SchoolSystem.Domain.Enums;
using System;

namespace SchoolSystem.Domain.Entities
{
    public class FeeInvoice : BaseEntity
    {
        public string InvoiceNumber { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;

        public decimal Amount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal RemainingAmount { get; set; }

        public DateTime DueDate { get; set; }
        public DateTime? PaidDate { get; set; }

        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        public string? ReceiptNumber { get; set; }  
        public string? PaymentMethod { get; set; }  
        public string? CardLastFour { get; set; } 
        public string? TransactionId { get; set; } 

        public Guid StudentId { get; set; }
        public virtual Student? Student { get; set; }

        public Guid? CreatedBy { get; set; }
        public string? Notes { get; set; }
        public virtual ICollection<PaymentTransaction> Payments { get; set; } = new List<PaymentTransaction>();
    }
}