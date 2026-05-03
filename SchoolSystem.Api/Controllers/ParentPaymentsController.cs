// API/Controllers/ParentPaymentsController.cs
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Application.Features.ParentPayments.Commands.MakePayment;
using SchoolSystem.Application.Features.ParentPayments.DTOs.Create;
using SchoolSystem.Application.Features.ParentPayments.Queries.GetPaymentHistory;
using SchoolSystem.Application.Features.ParentPayments.Queries.GetPaymentSummary;
using SchoolSystem.Application.Features.ParentPayments.Queries.GetReceipts;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SchoolSystem.API.Controllers
{
    [Route("api/parent/payments")]
    [ApiController]
    [Authorize(Roles = "Parent")]
    public class ParentPaymentsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ParentPaymentsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetPaymentSummary()
        {
            var result = await _mediator.Send(new GetParentPaymentSummaryQuery());

            return Ok(new
            {
                totalPaid = result.TotalPaid,
                pending = result.TotalPending,
                overdue = result.TotalOverdue,
                totalDue = result.TotalDue,
                overdueCount = result.OverdueCount,
                overdueAmount = result.OverdueAmount,
                totalChildren = result.TotalChildren,
                totalInvoices = result.TotalInvoices,
                hasOverduePayments = result.HasOverduePayments,
                minimumPaymentDue = result.MinimumPaymentDue
            });
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetPaymentHistory(
            [FromQuery] Guid? studentId,
            [FromQuery] string? category,
            [FromQuery] string? status,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var result = await _mediator.Send(new GetParentPaymentHistoryQuery
            {
                StudentId = studentId,
                Category = category,
                Status = status,
                Page = page,
                PageSize = pageSize
            });

            return Ok(new
            {
                items = result,
                totalCount = result.Count,
                page,
                pageSize
            });
        }

        [HttpGet("receipts")]
        public async Task<IActionResult> GetReceipts(
            [FromQuery] Guid? studentId,
            [FromQuery] string? category,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var result = await _mediator.Send(new GetParentReceiptsQuery
            {
                StudentId = studentId,
                Category = category,
                Page = page,
                PageSize = pageSize
            });

            // Get totals for UI
            var allReceipts = await _mediator.Send(new GetParentReceiptsQuery
            {
                Page = 1,
                PageSize = int.MaxValue
            });

            return Ok(new
            {
                totalReceipts = allReceipts.Count,
                totalAmount = allReceipts.Sum(r => r.Amount),
                latestPaymentDate = allReceipts.Any() ? allReceipts.Max(r => r.PaymentDate) : (DateTime?)null,
                page,
                pageSize,
                items = result
            });
        }

        [HttpPost("pay")]
        public async Task<IActionResult> MakePayment([FromBody] ParentMakePaymentDto payment)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (payment.InvoiceId == Guid.Empty)
                return BadRequest("Invoice ID is required");

            if (payment.Amount <= 0)
                return BadRequest("Payment amount must be greater than 0");

            var result = await _mediator.Send(new MakeParentPaymentCommand(payment));

            if (!result.Success)
                return BadRequest(result);

            return Ok(new
            {
                success = result.Success,
                message = result.Message,
                receiptNumber = result.ReceiptNumber,
                transactionId = result.TransactionId,
                paymentDate = result.PaymentDate,
                amountPaid = result.AmountPaid,
                remainingAmount = result.RemainingAmount,
                isFullyPaid = result.IsFullyPaid,
                invoiceNumber = result.InvoiceNumber,
                studentName = result.StudentName
            });
        }

        [HttpGet("overdue/summary")]
        public async Task<IActionResult> GetOverdueSummary()
        {
            var overduePayments = await _mediator.Send(new GetParentPaymentHistoryQuery
            {
                Status = "overdue",
                Page = 1,
                PageSize = int.MaxValue
            });

            return Ok(new
            {
                count = overduePayments.Count,
                totalAmount = overduePayments.Sum(p => p.RemainingAmount),
                hasOverdue = overduePayments.Any(),
                items = overduePayments.Take(5)
            });
        }
    }
}