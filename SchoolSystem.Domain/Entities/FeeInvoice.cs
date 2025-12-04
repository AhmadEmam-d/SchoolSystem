using SchoolSystem.Domain.Common;
using SchoolSystem.Domain.Entities;

public class FeeInvoice : BaseEntity
{
    public string InvoiceNumber { get; set; }

    public Guid StudentOid { get; set; }
    public Student Student { get; set; }

    public decimal Amount { get; set; }
    public decimal PaidAmount { get; set; }
    public bool IsPaid => PaidAmount >= Amount;

    public ICollection<FeePayment> Payments { get; set; }
}
