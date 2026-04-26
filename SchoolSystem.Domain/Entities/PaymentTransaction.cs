// Domain/Entities/PaymentTransaction.cs
using SchoolSystem.Domain.Common;
using System;

namespace SchoolSystem.Domain.Entities
{
    public class PaymentTransaction : BaseEntity
    {
        public Guid InvoiceId { get; set; }
        public virtual FeeInvoice? Invoice { get; set; }

        public decimal Amount { get; set; }
        public string? TransactionId { get; set; }
        public string? PaymentMethod { get; set; }
        public string? CardLastFour { get; set; }
        public string? Status { get; set; }
        public string? ErrorMessage { get; set; }
        public string? GatewayResponse { get; set; }
        public string? IpAddress { get; set; }
    }
}