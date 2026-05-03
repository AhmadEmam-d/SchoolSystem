// Application/Features/ParentPayments/Commands/MakePayment/MakeParentPaymentCommandHandler.cs
using MediatR;
using SchoolSystem.Application.Features.ParentPayments.DTOs.Create;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.ParentPayments.Commands.MakePayment
{
    public class MakeParentPaymentCommandHandler : IRequestHandler<MakeParentPaymentCommand, MakeParentPaymentResponse>
    {
        private readonly IGenericRepository<FeeInvoice> _invoiceRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<PaymentTransaction> _transactionRepo;
        private readonly IGenericRepository<Parent> _parentRepo;
        private readonly ICurrentUserService _currentUserService;

        public MakeParentPaymentCommandHandler(
            IGenericRepository<FeeInvoice> invoiceRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<PaymentTransaction> transactionRepo,
            IGenericRepository<Parent> parentRepo,
            ICurrentUserService currentUserService)
        {
            _invoiceRepo = invoiceRepo;
            _studentRepo = studentRepo;
            _transactionRepo = transactionRepo;
            _parentRepo = parentRepo;
            _currentUserService = currentUserService;
        }

        public async Task<MakeParentPaymentResponse> Handle(MakeParentPaymentCommand request, CancellationToken cancellationToken)
        {
            try
            {
                // 0. Get logged-in user and verify parent exists
                var userId = _currentUserService.UserId;
                if (!userId.HasValue)
                {
                    return new MakeParentPaymentResponse
                    {
                        Success = false,
                        Message = "User not authenticated"
                    };
                }

                var parent = _parentRepo.GetAllQueryable()
                    .FirstOrDefault(p => p.UserId == userId.Value && !p.IsDeleted);

                if (parent == null)
                {
                    return new MakeParentPaymentResponse
                    {
                        Success = false,
                        Message = "Parent record not found"
                    };
                }

                // 1. Validate invoice exists
                var invoice = await _invoiceRepo.GetByOidAsync(request.Payment.InvoiceId);

                if (invoice == null || invoice.IsDeleted)
                    return new MakeParentPaymentResponse
                    {
                        Success = false,
                        Message = "Invoice not found"
                    };

                // 2. Verify the student belongs to this parent
                var student = await _studentRepo.GetByOidAsync(invoice.StudentId);
                if (student == null || student.ParentOid != parent.Oid)
                {
                    return new MakeParentPaymentResponse
                    {
                        Success = false,
                        Message = "You are not authorized to pay for this student"
                    };
                }

                // 3. Validate payment amount
                if (request.Payment.Amount <= 0)
                    return new MakeParentPaymentResponse
                    {
                        Success = false,
                        Message = "Invalid payment amount"
                    };

                if (request.Payment.Amount > invoice.RemainingAmount)
                    return new MakeParentPaymentResponse
                    {
                        Success = false,
                        Message = $"Payment amount exceeds remaining balance of {invoice.RemainingAmount:F2} EGP"
                    };

                // 4. Validate card information
                var cardValidation = ValidateCardInfo(request.Payment);
                if (!cardValidation.IsValid)
                    return new MakeParentPaymentResponse
                    {
                        Success = false,
                        Message = cardValidation.ErrorMessage
                    };

                // 5. Process payment with gateway (simulated)
                var paymentResult = await ProcessPaymentWithGateway(request.Payment);

                if (!paymentResult.IsSuccessful)
                    return new MakeParentPaymentResponse
                    {
                        Success = false,
                        Message = paymentResult.ErrorMessage
                    };

                // 6. Update invoice
                var wasFullyPaid = false;
                invoice.PaidAmount += request.Payment.Amount;
                invoice.RemainingAmount = invoice.Amount - invoice.PaidAmount;
                invoice.PaidDate = DateTime.UtcNow;
                invoice.UpdatedAt = DateTime.UtcNow;

                if (invoice.RemainingAmount <= 0)
                {
                    invoice.Status = PaymentStatus.Paid;
                    wasFullyPaid = true;
                }
                else if (invoice.PaidAmount > 0 && invoice.RemainingAmount > 0)
                {
                    invoice.Status = PaymentStatus.Partial;
                }

                if (string.IsNullOrEmpty(invoice.ReceiptNumber) || wasFullyPaid)
                {
                    invoice.ReceiptNumber = GenerateReceiptNumber();
                }

                invoice.PaymentMethod = "Credit Card";
                var cleanCardNumber = request.Payment.CardNumber?.Replace(" ", "") ?? "";
                invoice.CardLastFour = cleanCardNumber.Length >= 4 ? cleanCardNumber[^4..] : "****";
                invoice.TransactionId = paymentResult.TransactionId;

                await _invoiceRepo.UpdateAsync(invoice);

                // 7. Save transaction record
                var transaction = new PaymentTransaction
                {
                    //Oid = Guid.NewGuid(),
                    InvoiceId = invoice.Oid,
                    Amount = request.Payment.Amount,
                    TransactionId = paymentResult.TransactionId,
                    PaymentMethod = "Credit Card",
                    CardLastFour = invoice.CardLastFour,
                    Status = "Success",
                    GatewayResponse = paymentResult.GatewayResponse,
                    //CreatedAt = DateTime.UtcNow
                };
                await _transactionRepo.CreateAsync(transaction);

                // 8. Get student name
                var studentName = student?.FullName ?? "Unknown";

                return new MakeParentPaymentResponse
                {
                    Success = true,
                    Message = "Payment processed successfully",
                    ReceiptNumber = invoice.ReceiptNumber,
                    TransactionId = paymentResult.TransactionId,
                    PaymentDate = DateTime.UtcNow,
                    AmountPaid = request.Payment.Amount,
                    RemainingAmount = invoice.RemainingAmount,
                    IsFullyPaid = wasFullyPaid,
                    InvoiceNumber = invoice.InvoiceNumber,
                    StudentName = studentName
                };
            }
            catch (Exception ex)
            {
                return new MakeParentPaymentResponse
                {
                    Success = false,
                    Message = $"Payment failed: {ex.Message}"
                };
            }
        }

        private CardValidationResult ValidateCardInfo(ParentMakePaymentDto payment)
        {
            var cardNumber = payment.CardNumber?.Replace(" ", "") ?? "";

            if (string.IsNullOrEmpty(cardNumber) || cardNumber.Length < 13 || cardNumber.Length > 19)
                return new CardValidationResult { IsValid = false, ErrorMessage = "Invalid card number" };

            if (string.IsNullOrEmpty(payment.ExpiryDate))
                return new CardValidationResult { IsValid = false, ErrorMessage = "Expiry date is required" };

            var expiryParts = payment.ExpiryDate.Split('/');
            if (expiryParts.Length != 2)
                return new CardValidationResult { IsValid = false, ErrorMessage = "Invalid expiry date format (MM/YY)" };

            if (!int.TryParse(expiryParts[0], out int month) || month < 1 || month > 12)
                return new CardValidationResult { IsValid = false, ErrorMessage = "Invalid expiry month" };

            if (!int.TryParse(expiryParts[1], out int year))
                return new CardValidationResult { IsValid = false, ErrorMessage = "Invalid expiry year" };

            var currentDate = DateTime.UtcNow;
            var expiryDate = new DateTime(2000 + year, month, 1).AddMonths(1).AddDays(-1);

            if (expiryDate < currentDate)
                return new CardValidationResult { IsValid = false, ErrorMessage = "Card has expired" };

            if (string.IsNullOrEmpty(payment.Cvv) || payment.Cvv.Length < 3 || payment.Cvv.Length > 4)
                return new CardValidationResult { IsValid = false, ErrorMessage = "Invalid CVV" };

            if (string.IsNullOrEmpty(payment.CardholderName))
                return new CardValidationResult { IsValid = false, ErrorMessage = "Cardholder name is required" };

            return new CardValidationResult { IsValid = true };
        }

        private Task<GatewayPaymentResult> ProcessPaymentWithGateway(ParentMakePaymentDto payment)
        {
            // Simulate payment gateway processing
            var gatewayResponse = $@"{{
                ""success"": true,
                ""transactionId"": ""{Guid.NewGuid():N}"",
                ""amount"": {payment.Amount},
                ""currency"": ""EGP"",
                ""timestamp"": ""{DateTime.UtcNow:O}""
            }}";

            return Task.FromResult(new GatewayPaymentResult
            {
                IsSuccessful = true,
                TransactionId = $"TXN-{DateTime.Now:yyyyMMddHHmmss}-{Guid.NewGuid():N}"[..24].ToUpper(),
                GatewayResponse = gatewayResponse
            });
        }

        private string GenerateReceiptNumber()
        {
            return $"RCP-{DateTime.Now:yyyyMMdd}-{Guid.NewGuid():N}"[..15].ToUpper();
        }
    }

    public class CardValidationResult
    {
        public bool IsValid { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
    }

    public class GatewayPaymentResult
    {
        public bool IsSuccessful { get; set; }
        public string TransactionId { get; set; } = string.Empty;
        public string ErrorMessage { get; set; } = string.Empty;
        public string GatewayResponse { get; set; } = string.Empty;
    }
}