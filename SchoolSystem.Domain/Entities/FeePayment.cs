using SchoolSystem.Domain.Common;
using SchoolSystem.Domain.Entities;

public class FeePayment : BaseEntity
{
    public Guid FeeInvoiceOid { get; set; }
    public FeeInvoice FeeInvoice { get; set; }

    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
}
