// Application/Features/ParentPayments/Commands/MakePayment/MakeParentPaymentCommand.cs
using MediatR;
using SchoolSystem.Application.Features.ParentPayments.DTOs.Create;
using System;

namespace SchoolSystem.Application.Features.ParentPayments.Commands.MakePayment
{
    public class MakeParentPaymentCommand : IRequest<MakeParentPaymentResponse>
    {
        public ParentMakePaymentDto Payment { get; set; }

        public MakeParentPaymentCommand(ParentMakePaymentDto payment)
        {
            Payment = payment;
        }
    }

    public class MakeParentPaymentResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? ReceiptNumber { get; set; }
        public string? TransactionId { get; set; }
        public DateTime PaymentDate { get; set; }
        public decimal AmountPaid { get; set; }
        public decimal RemainingAmount { get; set; }
        public bool IsFullyPaid { get; set; }
        public string? InvoiceNumber { get; set; }
        public string? StudentName { get; set; }
    }
}