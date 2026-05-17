// Application/Features/Invoices/Commands/BulkCreateInvoices/BulkCreateInvoicesCommandHandler.cs
using MediatR;
using SchoolSystem.Application.Features.Invoices.DTOs;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Invoices.Commands.BulkCreateInvoices
{
    public class BulkCreateInvoicesCommandHandler : IRequestHandler<BulkCreateInvoicesCommand, BulkCreateInvoicesResponse>
    {
        private readonly IGenericRepository<FeeInvoice> _invoiceRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly ICurrentUserService _currentUserService;

        public BulkCreateInvoicesCommandHandler(
            IGenericRepository<FeeInvoice> invoiceRepo,
            IGenericRepository<Student> studentRepo,
            ICurrentUserService currentUserService)
        {
            _invoiceRepo = invoiceRepo;
            _studentRepo = studentRepo;
            _currentUserService = currentUserService;
        }

        public async Task<BulkCreateInvoicesResponse> Handle(BulkCreateInvoicesCommand request, CancellationToken cancellationToken)
        {
            var response = new BulkCreateInvoicesResponse();
            var createdInvoices = new List<Guid>();

            foreach (var studentId in request.Dto.StudentIds)
            {
                try
                {
                    var student = await _studentRepo.GetByOidAsync(studentId);
                    if (student == null || student.IsDeleted)
                    {
                        response.Failed.Add(new BulkInvoiceError { StudentId = studentId, Error = "Student not found" });
                        continue;
                    }

                    var status = request.Dto.DueDate < DateTime.UtcNow.Date ? PaymentStatus.Overdue : PaymentStatus.Pending;

                    var invoice = new FeeInvoice
                    {
                        Oid = Guid.NewGuid(),
                        InvoiceNumber = GenerateInvoiceNumber(),
                        Title = request.Dto.Title,
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
                    createdInvoices.Add(invoice.Oid);
                    response.SuccessCount++;
                }
                catch (Exception ex)
                {
                    response.Failed.Add(new BulkInvoiceError { StudentId = studentId, Error = ex.Message });
                }
            }

            response.CreatedInvoiceIds = createdInvoices;
            return response;
        }

        private string GenerateInvoiceNumber()
        {
            return $"INV-{DateTime.Now:yyyyMMdd}-{Guid.NewGuid():N}"[..15].ToUpper();
        }
    }

    public class BulkCreateInvoicesCommand : IRequest<BulkCreateInvoicesResponse>
    {
        public BulkCreateInvoicesDto Dto { get; set; } = new();
    }

    public class BulkCreateInvoicesResponse
    {
        public int SuccessCount { get; set; }
        public List<BulkInvoiceError> Failed { get; set; } = new();
        public List<Guid> CreatedInvoiceIds { get; set; } = new();
    }

    public class BulkInvoiceError
    {
        public Guid StudentId { get; set; }
        public string Error { get; set; } = string.Empty;
    }
}