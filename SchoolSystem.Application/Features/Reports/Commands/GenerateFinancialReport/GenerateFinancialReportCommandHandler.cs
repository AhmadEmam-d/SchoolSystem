// Application/Features/Reports/Commands/GenerateFinancialReport/GenerateFinancialReportCommandHandler.cs
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Reports.DTOs;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Reports.Commands.GenerateFinancialReport
{
    public class GenerateFinancialReportCommandHandler : IRequestHandler<GenerateFinancialReportCommand, Guid>
    {
        private readonly IGenericRepository<FinancialReport> _financialReportRepo;
        private readonly IGenericRepository<FeeInvoice> _feeInvoiceRepo;
        private readonly IGenericRepository<PaymentTransaction> _paymentTransactionRepo;
        private readonly ICurrentUserService _currentUser;
        private readonly IMapper _mapper;

        public GenerateFinancialReportCommandHandler(
            IGenericRepository<FinancialReport> financialReportRepo,
            IGenericRepository<FeeInvoice> feeInvoiceRepo,
            IGenericRepository<PaymentTransaction> paymentTransactionRepo,
            ICurrentUserService currentUser,
            IMapper mapper)
        {
            _financialReportRepo = financialReportRepo;
            _feeInvoiceRepo = feeInvoiceRepo;
            _paymentTransactionRepo = paymentTransactionRepo;
            _currentUser = currentUser;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(GenerateFinancialReportCommand request, CancellationToken cancellationToken)
        {
            // Get invoices within date range
            var invoices = await _feeInvoiceRepo.GetAllQueryable()
                .Where(i => i.CreatedAt >= request.Dto.StartDate &&
                           i.CreatedAt <= request.Dto.EndDate &&
                           !i.IsDeleted)
                .ToListAsync(cancellationToken);

            // Get successful payment transactions within date range
            var payments = await _paymentTransactionRepo.GetAllQueryable()
                .Where(p => p.CreatedAt >= request.Dto.StartDate &&
                           p.CreatedAt <= request.Dto.EndDate &&
                           p.Status == "Success")
                .ToListAsync(cancellationToken);

            // Calculate financial metrics
            var totalIncome = payments.Sum(p => p.Amount);
            var totalInvoiced = invoices.Sum(i => i.Amount);
            var totalPaidInvoices = invoices.Where(i => i.Status == PaymentStatus.Paid).Sum(i => i.PaidAmount);
            var totalPendingInvoices = invoices.Where(i => i.Status == PaymentStatus.Pending).Sum(i => i.RemainingAmount);
            var totalOverdueInvoices = invoices.Where(i => i.Status == PaymentStatus.Overdue).Sum(i => i.RemainingAmount);
            var totalPartialInvoices = invoices.Where(i => i.Status == PaymentStatus.Partial).Sum(i => i.PaidAmount);

            // Calculate expenses (example: 30% of total income as operational costs)
            var totalExpenses = totalIncome * 0.3m;
            var netProfit = totalIncome - totalExpenses;

            // Calculate collection rate
            var collectionRate = totalInvoiced > 0 ? (totalPaidInvoices / totalInvoiced) * 100 : 0;

            // Prepare detailed report data
            var details = new
            {
                TotalInvoices = invoices.Count,
                TotalPayments = payments.Count,
                AveragePayment = payments.Any() ? payments.Average(p => p.Amount) : 0,
                PaidInvoicesCount = invoices.Count(i => i.Status == PaymentStatus.Paid),
                PendingInvoicesCount = invoices.Count(i => i.Status == PaymentStatus.Pending),
                OverdueInvoicesCount = invoices.Count(i => i.Status == PaymentStatus.Overdue),
                PartialInvoicesCount = invoices.Count(i => i.Status == PaymentStatus.Partial),

                TotalInvoicedAmount = totalInvoiced,
                TotalPaidAmount = totalPaidInvoices,
                TotalPendingAmount = totalPendingInvoices,
                TotalOverdueAmount = totalOverdueInvoices,
                TotalPartialAmount = totalPartialInvoices,

                CollectionRate = Math.Round(collectionRate, 2),

                InvoicesByCategory = invoices.GroupBy(i => i.Category)
                    .Where(g => !string.IsNullOrEmpty(g.Key))
                    .Select(g => new {
                        Category = g.Key,
                        Count = g.Count(),
                        Total = g.Sum(x => x.Amount),
                        Paid = g.Sum(x => x.PaidAmount),
                        Pending = g.Sum(x => x.RemainingAmount)
                    })
                    .ToList(),

                DailyPaymentSummary = payments.GroupBy(p => p.CreatedAt.Date)
                    .Select(g => new {
                        Date = g.Key,
                        Count = g.Count(),
                        Total = g.Sum(x => x.Amount)
                    })
                    .OrderBy(g => g.Date)
                    .ToList(),

                PaymentMethodBreakdown = payments.GroupBy(p => p.PaymentMethod)
                    .Select(g => new {
                        Method = g.Key ?? "Unknown",
                        Count = g.Count(),
                        Total = g.Sum(x => x.Amount)
                    })
                    .ToList()
            };

            var periodText = $"{request.Dto.StartDate:yyyy-MM-dd} to {request.Dto.EndDate:yyyy-MM-dd}";

            var financialReport = new FinancialReport
            {
                Oid = Guid.NewGuid(),
                Period = periodText,
                StartDate = request.Dto.StartDate,
                EndDate = request.Dto.EndDate,
                TotalIncome = totalIncome,
                TotalExpenses = totalExpenses,
                NetProfit = netProfit,
                Details = JsonSerializer.Serialize(details),
                GeneratedAt = DateTime.UtcNow,
                GeneratedBy = _currentUser?.UserId,
                CreatedAt = DateTime.UtcNow
            };

            await _financialReportRepo.AddAsync(financialReport);
            return financialReport.Oid;
        }
    }
}