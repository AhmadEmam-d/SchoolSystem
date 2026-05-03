// Application/Features/Invoices/Commands/CreateInvoice/CreateInvoiceCommandHandler.cs
using MediatR;
using SchoolSystem.Application.Features.Invoices.DTOs;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Invoices.Commands.CreateInvoice
{
    public class CreateInvoiceCommandHandler : IRequestHandler<CreateInvoiceCommand, Guid>
    {
        private readonly IGenericRepository<FeeInvoice> _invoiceRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly ICurrentUserService _currentUserService;

        public CreateInvoiceCommandHandler(
            IGenericRepository<FeeInvoice> invoiceRepo,
            IGenericRepository<Student> studentRepo,
            ICurrentUserService currentUserService)
        {
            _invoiceRepo = invoiceRepo;
            _studentRepo = studentRepo;
            _currentUserService = currentUserService;
        }

        public async Task<Guid> Handle(CreateInvoiceCommand request, CancellationToken cancellationToken)
        {
            // Validate student exists
            var student = await _studentRepo.GetByOidAsync(request.Dto.StudentId);
            if (student == null || student.IsDeleted)
                throw new Exception("Student not found");

            // Determine status based on due date
            var status = request.Dto.DueDate < DateTime.UtcNow.Date
                ? PaymentStatus.Overdue
                : PaymentStatus.Pending;

            // Create invoice
            var invoice = new FeeInvoice
            {
                Oid = Guid.NewGuid(),
                InvoiceNumber = GenerateInvoiceNumber(),
                Title = request.Dto.Title,
                Description = request.Dto.Description,
                Category = request.Dto.Category,
                Amount = request.Dto.Amount,
                PaidAmount = 0,
                RemainingAmount = request.Dto.Amount,
                DueDate = request.Dto.DueDate,
                Status = status,
                StudentId = student.Oid,
                Notes = request.Dto.Notes,
                CreatedBy = _currentUserService.UserId,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            };

            await _invoiceRepo.CreateAsync(invoice);
            return invoice.Oid;
        }

        private string GenerateInvoiceNumber()
        {
            return $"INV-{DateTime.Now:yyyyMMdd}-{Guid.NewGuid():N}"[..15].ToUpper();
        }
    }
}