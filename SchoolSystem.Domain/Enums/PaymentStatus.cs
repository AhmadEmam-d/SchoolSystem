// Domain/Enums/PaymentStatus.cs
namespace SchoolSystem.Domain.Enums
{
    public enum PaymentStatus
    {
        Pending = 0,
        Paid = 1,
        Overdue = 2,
        Partial = 3,
        Refunded = 4
    }
}