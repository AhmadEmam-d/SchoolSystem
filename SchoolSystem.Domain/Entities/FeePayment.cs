using SchoolSystem.Domain.Common;
using SchoolSystem.Domain.Entities;

public class FeePayment : BaseEntity
{
    public Guid FeeInvoiceOid { get; set; }
    public FeeInvoice FeeInvoice { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; } 
    public string PaymentMethod { get; set; }
    public string TransactionId { get; set; }
    public string ReceiptNumber { get; set; }
}
