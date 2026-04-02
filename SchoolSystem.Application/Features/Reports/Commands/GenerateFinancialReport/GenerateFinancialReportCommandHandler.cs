using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Reports.DTOs;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Reports.Commands.GenerateFinancialReport
{
    public class GenerateFinancialReportCommandHandler : IRequestHandler<GenerateFinancialReportCommand, Guid>
    {
        private readonly IGenericRepository<FinancialReport> _financialReportRepo;
        private readonly IGenericRepository<FeeInvoice> _feeInvoiceRepo;
        private readonly IGenericRepository<FeePayment> _feePaymentRepo;
        private readonly ICurrentUserService _currentUser;
        private readonly IMapper _mapper;

        public GenerateFinancialReportCommandHandler(
            IGenericRepository<FinancialReport> financialReportRepo,
            IGenericRepository<FeeInvoice> feeInvoiceRepo,
            IGenericRepository<FeePayment> feePaymentRepo,
            ICurrentUserService currentUser,
            IMapper mapper)
        {
            _financialReportRepo = financialReportRepo;
            _feeInvoiceRepo = feeInvoiceRepo;
            _feePaymentRepo = feePaymentRepo;
            _currentUser = currentUser;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(GenerateFinancialReportCommand request, CancellationToken cancellationToken)
        {
            var invoices = await _feeInvoiceRepo.GetAllQueryable()
                .Where(i => i.CreatedAt >= request.Dto.StartDate && i.CreatedAt <= request.Dto.EndDate)
                .ToListAsync(cancellationToken);

            var payments = await _feePaymentRepo.GetAllQueryable()
                .Where(p => p.PaymentDate >= request.Dto.StartDate && p.PaymentDate <= request.Dto.EndDate)
                .ToListAsync(cancellationToken);

            var totalIncome = payments.Sum(p => p.Amount);
            var totalExpenses = invoices.Sum(i => i.Amount) * 0.3m; // Placeholder for expenses
            var netProfit = totalIncome - totalExpenses;

            var details = new
            {
                TotalInvoices = invoices.Count,
                TotalPayments = payments.Count,
                AveragePayment = payments.Any() ? payments.Average(p => p.Amount) : 0
            };

            var financialReport = new FinancialReport
            {
                Period = $"{request.Dto.StartDate:yyyy-MM-dd} to {request.Dto.EndDate:yyyy-MM-dd}",
                StartDate = request.Dto.StartDate,
                EndDate = request.Dto.EndDate,
                TotalIncome = totalIncome,
                TotalExpenses = totalExpenses,
                NetProfit = netProfit,
                Details = System.Text.Json.JsonSerializer.Serialize(details),
                GeneratedAt = DateTime.UtcNow
            };

            await _financialReportRepo.AddAsync(financialReport);
            return financialReport.Oid;
        }
    }
}