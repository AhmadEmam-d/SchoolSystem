// Application/Features/ParentPayments/Queries/GetPaymentHistory/GetParentPaymentHistoryQueryHandler.cs
using MediatR;
using SchoolSystem.Application.Features.ParentPayments.DTOs.Read;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.ParentPayments.Queries.GetPaymentHistory
{
    public class GetParentPaymentHistoryQueryHandler : IRequestHandler<GetParentPaymentHistoryQuery, List<ParentPaymentHistoryDto>>
    {
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<FeeInvoice> _invoiceRepo;
        private readonly IGenericRepository<Parent> _parentRepo;
        private readonly ICurrentUserService _currentUserService;

        public GetParentPaymentHistoryQueryHandler(
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

        public async Task<List<ParentPaymentHistoryDto>> Handle(GetParentPaymentHistoryQuery request, CancellationToken cancellationToken)
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

            // Get students for this parent
            var students = _studentRepo.GetAllQueryable()
                .Where(s => s.ParentOid == parentId && !s.IsDeleted)
                .ToList();

            if (request.StudentId.HasValue)
                students = students.Where(s => s.Oid == request.StudentId.Value).ToList();

            var studentIds = students.Select(s => s.Oid).ToList();
            var studentDict = students.ToDictionary(s => s.Oid, s => s);

            if (!studentIds.Any())
                return new List<ParentPaymentHistoryDto>();

            // Get invoices
            var invoices = _invoiceRepo.GetAllQueryable()
                .Where(i => studentIds.Contains(i.StudentId) && !i.IsDeleted)
                .OrderByDescending(i => i.DueDate)
                .ToList();

            var today = DateTime.UtcNow.Date;

            // Apply filters
            if (!string.IsNullOrEmpty(request.Category))
            {
                invoices = invoices.Where(i => i.Category != null && i.Category.Contains(request.Category)).ToList();
            }

            if (!string.IsNullOrEmpty(request.Status))
            {
                invoices = request.Status.ToLower() switch
                {
                    "paid" => invoices.Where(i => i.Status == PaymentStatus.Paid).ToList(),
                    "pending" => invoices.Where(i => i.Status == PaymentStatus.Pending && i.DueDate >= today).ToList(),
                    "overdue" => invoices.Where(i => i.Status == PaymentStatus.Overdue ||
                                                    (i.Status == PaymentStatus.Pending && i.DueDate < today)).ToList(),
                    "partial" => invoices.Where(i => i.Status == PaymentStatus.Partial).ToList(),
                    _ => invoices
                };
            }

            // Map to DTO
            var result = new List<ParentPaymentHistoryDto>();

            foreach (var invoice in invoices)
            {
                var student = studentDict.GetValueOrDefault(invoice.StudentId);
                var isOverdue = invoice.Status == PaymentStatus.Overdue ||
                               (invoice.Status == PaymentStatus.Pending && invoice.DueDate < today);
                var daysOverdue = isOverdue ? (today - invoice.DueDate).Days : 0;

                result.Add(new ParentPaymentHistoryDto
                {
                    InvoiceId = invoice.Oid,
                    InvoiceNumber = invoice.InvoiceNumber,
                    Title = invoice.Title,
                    Category = invoice.Category,
                    Amount = invoice.Amount,
                    PaidAmount = invoice.PaidAmount,
                    RemainingAmount = invoice.RemainingAmount,
                    DueDate = invoice.DueDate,
                    Status = GetStatusString(invoice, today),
                    PaidDate = invoice.PaidDate,
                    ReceiptNumber = invoice.ReceiptNumber,
                    StudentName = student?.FullName ?? "Unknown",
                    StudentId = invoice.StudentId,
                    CanPay = invoice.Status != PaymentStatus.Paid && invoice.RemainingAmount > 0,
                    IsOverdue = isOverdue,
                    DaysOverdue = daysOverdue
                });
            }

            // Apply pagination
            result = result.Skip((request.Page - 1) * request.PageSize)
                           .Take(request.PageSize)
                           .ToList();

            return result;
        }

        private string GetStatusString(FeeInvoice invoice, DateTime today)
        {
            if (invoice.Status == PaymentStatus.Paid)
                return "Paid";

            if (invoice.Status == PaymentStatus.Overdue)
                return "Overdue";

            if (invoice.Status == PaymentStatus.Partial)
                return "Partial";

            if (invoice.DueDate < today)
                return "Overdue";

            return "Pending";
        }
    }
}