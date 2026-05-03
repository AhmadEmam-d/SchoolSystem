// Application/Features/Invoices/Commands/GenerateMonthlyFees/GenerateMonthlyFeesCommandHandler.cs
using MediatR;
using SchoolSystem.Application.Features.Invoices.DTOs;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Invoices.Commands.GenerateMonthlyFees
{
    public class GenerateMonthlyFeesCommandHandler : IRequestHandler<GenerateMonthlyFeesCommand, MonthlyFeesGenerationResponse>
    {
        private readonly IGenericRepository<FeeInvoice> _invoiceRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<Class> _classRepo;
        private readonly ICurrentUserService _currentUserService;

        public GenerateMonthlyFeesCommandHandler(
            IGenericRepository<FeeInvoice> invoiceRepo,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<Class> classRepo,
            ICurrentUserService currentUserService)
        {
            _invoiceRepo = invoiceRepo;
            _studentRepo = studentRepo;
            _classRepo = classRepo;
            _currentUserService = currentUserService;
        }

        public async Task<MonthlyFeesGenerationResponse> Handle(GenerateMonthlyFeesCommand request, CancellationToken cancellationToken)
        {
            // Get active students
            var studentsQuery = _studentRepo.GetAllQueryable()
                .Where(s => !s.IsDeleted);

            if (request.Dto.ClassIds != null && request.Dto.ClassIds.Any())
            {
                studentsQuery = studentsQuery.Where(s => request.Dto.ClassIds.Contains(s.ClassOid));
            }

            var students = studentsQuery.ToList();
            var response = new MonthlyFeesGenerationResponse();
            var dueDate = new DateTime(request.Dto.Year, request.Dto.Month, 1);
            var title = $"Tuition Fee - {dueDate:MMMM yyyy}";

            foreach (var student in students)
            {
                try
                {
                    // Check if invoice already exists for this month
                    var existingInvoice = _invoiceRepo.GetAllQueryable()
                        .Any(i => i.StudentId == student.Oid &&
                                 i.Title == title &&
                                 i.DueDate.Year == request.Dto.Year &&
                                 i.DueDate.Month == request.Dto.Month);

                    if (existingInvoice)
                    {
                        response.Skipped++;
                        continue;
                    }

                    var invoice = new FeeInvoice
                    {
                        Oid = Guid.NewGuid(),
                        InvoiceNumber = GenerateInvoiceNumber(),
                        Title = title,
                        Description = $"Monthly tuition fee for {dueDate:MMMM yyyy}",
                        Category = "Tuition",
                        Amount = request.Dto.BaseAmount,
                        PaidAmount = 0,
                        RemainingAmount = request.Dto.BaseAmount,
                        DueDate = dueDate,
                        Status = PaymentStatus.Pending,
                        StudentId = student.Oid,
                        CreatedBy = _currentUserService.UserId,
                        CreatedAt = DateTime.UtcNow,
                        IsDeleted = false
                    };

                    await _invoiceRepo.CreateAsync(invoice);
                    response.Generated++;
                    response.GeneratedInvoiceIds.Add(invoice.Oid);
                }
                catch (Exception ex)
                {
                    response.Failed++;
                    response.Errors.Add($"Student {student.FullName}: {ex.Message}");
                }
            }

            return response;
        }

        private string GenerateInvoiceNumber()
        {
            return $"INV-{DateTime.Now:yyyyMMdd}-{Guid.NewGuid():N}"[..15].ToUpper();
        }
    }

    public class GenerateMonthlyFeesCommand : IRequest<MonthlyFeesGenerationResponse>
    {
        public GenerateMonthlyFeesDto Dto { get; set; }
    }

    public class MonthlyFeesGenerationResponse
    {
        public int Generated { get; set; }
        public int Skipped { get; set; }
        public int Failed { get; set; }
        public List<string> Errors { get; set; } = new();
        public List<Guid> GeneratedInvoiceIds { get; set; } = new();
    }
}