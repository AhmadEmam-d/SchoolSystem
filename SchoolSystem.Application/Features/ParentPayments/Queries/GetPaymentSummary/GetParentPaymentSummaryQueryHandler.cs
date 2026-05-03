// Application/Features/ParentPayments/Queries/GetPaymentSummary/GetParentPaymentSummaryQueryHandler.cs
using MediatR;
using SchoolSystem.Application.Features.ParentPayments.DTOs.Read;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.ParentPayments.Queries.GetPaymentSummary
{
    public class GetParentPaymentSummaryQueryHandler : IRequestHandler<GetParentPaymentSummaryQuery, ParentPaymentSummaryDto>
    {
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<FeeInvoice> _invoiceRepo;
        private readonly IGenericRepository<Parent> _parentRepo;
        private readonly ICurrentUserService _currentUserService;

        public GetParentPaymentSummaryQueryHandler(
            IGenericRepository<Student> studentRepo,
            IGenericRepository<FeeInvoice> invoiceRepo,
            IGenericRepository<Parent> parentRepo,
            ICurrentUserService currentUserService)
        {
            _studentRepo = studentRepo;
            _invoiceRepo = invoiceRepo;
            _parentRepo = parentRepo;
            _currentUserService = currentUserService;
        }

        public async Task<ParentPaymentSummaryDto> Handle(GetParentPaymentSummaryQuery request, CancellationToken cancellationToken)
        {
            // Get logged-in user ID
            var userId = _currentUserService.UserId;

            if (!userId.HasValue)
            {
                throw new UnauthorizedAccessException("User not authenticated");
            }

            // Get parent record using UserId
            var parent = _parentRepo.GetAllQueryable()
                .FirstOrDefault(p => p.UserId == userId.Value && !p.IsDeleted);

            if (parent == null)
            {
                throw new UnauthorizedAccessException("Parent record not found for this user");
            }

            var parentId = parent.Oid;

            // Get all students for this parent
            var students = _studentRepo.GetAllQueryable()
                .Where(s => s.ParentOid == parentId && !s.IsDeleted)
                .ToList();

            if (!students.Any())
            {
                return new ParentPaymentSummaryDto
                {
                    TotalPaid = 0,
                    TotalPending = 0,
                    TotalOverdue = 0,
                    TotalDue = 0,
                    OverdueCount = 0,
                    TotalChildren = 0,
                    TotalInvoices = 0,
                    HasOverduePayments = false,
                    MinimumPaymentDue = 0
                };
            }

            var studentIds = students.Select(s => s.Oid).ToList();
            var today = DateTime.UtcNow.Date;

            // Get all invoices
            var invoices = _invoiceRepo.GetAllQueryable()
                .Where(i => studentIds.Contains(i.StudentId) && !i.IsDeleted)
                .ToList();

            if (!invoices.Any())
            {
                return new ParentPaymentSummaryDto
                {
                    TotalPaid = 0,
                    TotalPending = 0,
                    TotalOverdue = 0,
                    TotalDue = 0,
                    OverdueCount = 0,
                    TotalChildren = students.Count,
                    TotalInvoices = 0,
                    HasOverduePayments = false,
                    MinimumPaymentDue = 0
                };
            }

            // Calculate summary
            var paidInvoices = invoices.Where(i => i.Status == PaymentStatus.Paid);
            var pendingInvoices = invoices.Where(i => i.Status == PaymentStatus.Pending);
            var overdueInvoices = invoices.Where(i => i.Status == PaymentStatus.Overdue);
            var partialInvoices = invoices.Where(i => i.Status == PaymentStatus.Partial);

            var totalPaid = paidInvoices.Sum(i => i.PaidAmount) + partialInvoices.Sum(i => i.PaidAmount);
            var totalPending = pendingInvoices.Sum(i => i.RemainingAmount);
            var totalOverdue = overdueInvoices.Sum(i => i.RemainingAmount);

            // Include pending invoices that are past due date
            var pastDuePending = pendingInvoices.Where(i => i.DueDate < today).ToList();
            var pastDueAmount = pastDuePending.Sum(i => i.RemainingAmount);
            totalOverdue += pastDueAmount;

            var overdueCount = overdueInvoices.Count() + pastDuePending.Count();
            var adjustedPending = totalPending - pastDueAmount;

            var summary = new ParentPaymentSummaryDto
            {
                TotalPaid = totalPaid,
                TotalPending = adjustedPending,
                TotalOverdue = totalOverdue,
                TotalDue = adjustedPending + totalOverdue,
                OverdueCount = overdueCount,
                OverdueAmount = totalOverdue,
                TotalChildren = students.Count,
                TotalInvoices = invoices.Count,
                HasOverduePayments = overdueCount > 0,
                MinimumPaymentDue = totalOverdue > 0 ? totalOverdue : (totalPending > 0 ? totalPending : 0)
            };

            return summary;
        }
    }
}