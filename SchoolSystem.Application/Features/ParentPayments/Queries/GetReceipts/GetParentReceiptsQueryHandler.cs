// Application/Features/ParentPayments/Queries/GetReceipts/GetParentReceiptsQueryHandler.cs
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

namespace SchoolSystem.Application.Features.ParentPayments.Queries.GetReceipts
{
    public class GetParentReceiptsQueryHandler : IRequestHandler<GetParentReceiptsQuery, List<ParentReceiptDto>>
    {
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<FeeInvoice> _invoiceRepo;
        private readonly IGenericRepository<Parent> _parentRepo;
        private readonly ICurrentUserService _currentUserService;

        public GetParentReceiptsQueryHandler(
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

        public async Task<List<ParentReceiptDto>> Handle(GetParentReceiptsQuery request, CancellationToken cancellationToken)
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
            var studentIds = _studentRepo.GetAllQueryable()
                .Where(s => s.ParentOid == parentId && !s.IsDeleted)
                .Select(s => s.Oid)
                .ToList();

            if (!studentIds.Any())
                return new List<ParentReceiptDto>();

            // Get paid invoices with receipts
            var receipts = _invoiceRepo.GetAllQueryable()
                .Where(i => studentIds.Contains(i.StudentId) &&
                           i.Status == PaymentStatus.Paid &&
                           i.ReceiptNumber != null &&
                           !i.IsDeleted)
                .OrderByDescending(i => i.PaidDate)
                .ToList();

            // Apply filters
            if (request.StudentId.HasValue)
            {
                receipts = receipts.Where(r => r.StudentId == request.StudentId.Value).ToList();
            }

            if (!string.IsNullOrEmpty(request.Category))
            {
                receipts = receipts.Where(r => r.Category == request.Category).ToList();
            }

            // Apply pagination
            receipts = receipts.Skip((request.Page - 1) * request.PageSize)
                               .Take(request.PageSize)
                               .ToList();

            // Get student names
            var students = _studentRepo.GetAllQueryable()
                .Where(s => studentIds.Contains(s.Oid))
                .ToDictionary(s => s.Oid, s => s.FullName);

            // Map to DTO
            var result = receipts.Select(r => new ParentReceiptDto
            {
                ReceiptNumber = r.ReceiptNumber ?? string.Empty,
                InvoiceNumber = r.InvoiceNumber,
                Title = r.Title,
                Category = r.Category,
                Amount = r.PaidAmount,
                PaymentDate = r.PaidDate ?? r.CreatedAt,
                PaymentMethod = r.PaymentMethod ?? "Unknown",
                StudentName = students.GetValueOrDefault(r.StudentId) ?? "Unknown",
                CardLastFour = r.CardLastFour,
                TransactionId = r.TransactionId,
                Status = "Completed"
            }).ToList();

            return result;
        }
    }
}