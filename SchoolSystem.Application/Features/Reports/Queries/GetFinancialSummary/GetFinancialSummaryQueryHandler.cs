// Application/Features/Reports/Queries/GetFinancialSummary/GetFinancialSummaryQueryHandler.cs
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Reports.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Reports.Queries.GetFinancialSummary
{
    public class GetFinancialSummaryQueryHandler : IRequestHandler<GetFinancialSummaryQuery, FinancialSummaryDto>
    {
        private readonly IGenericRepository<FeeInvoice> _feeInvoiceRepo;
        private readonly IGenericRepository<PaymentTransaction> _paymentTransactionRepo;
        private readonly IMapper _mapper;

        public GetFinancialSummaryQueryHandler(
            IGenericRepository<FeeInvoice> feeInvoiceRepo,
            IGenericRepository<PaymentTransaction> paymentTransactionRepo,
            IMapper mapper)
        {
            _feeInvoiceRepo = feeInvoiceRepo;
            _paymentTransactionRepo = paymentTransactionRepo;
            _mapper = mapper;
        }

        public async Task<FinancialSummaryDto> Handle(GetFinancialSummaryQuery request, CancellationToken cancellationToken)
        {
            // Determine date range
            var endDate = request.EndDate ?? DateTime.UtcNow;
            var startDate = request.StartDate ?? (request.Year.HasValue
                ? new DateTime(request.Year.Value, 1, 1)
                : endDate.AddMonths(-12));

            // Get invoices within date range
            var invoices = await _feeInvoiceRepo.GetAllQueryable()
                .Where(i => !i.IsDeleted &&
                           i.CreatedAt >= startDate &&
                           i.CreatedAt <= endDate)
                .ToListAsync(cancellationToken);

            // Get successful payment transactions within date range
            var payments = await _paymentTransactionRepo.GetAllQueryable()
                .Where(p => p.Status == "Success" &&
                           p.CreatedAt >= startDate &&
                           p.CreatedAt <= endDate)
                .ToListAsync(cancellationToken);

            // Calculate totals
            var totalIncome = payments.Sum(p => p.Amount);
            var totalExpenses = totalIncome * 0.3m; // 30% operational costs
            var netProfit = totalIncome - totalExpenses;

            // Prepare monthly data
            var monthlyData = new List<MonthlyFinancialDto>();
            var currentYear = startDate.Year;
            var startMonth = startDate.Month;
            var endMonth = endDate.Month;
            var monthCount = ((endDate.Year - startDate.Year) * 12) + (endMonth - startMonth) + 1;

            for (int i = 0; i < monthCount; i++)
            {
                var date = startDate.AddMonths(i);
                var monthlyPayments = payments
                    .Where(p => p.CreatedAt.Year == date.Year && p.CreatedAt.Month == date.Month)
                    .ToList();

                var monthlyIncome = monthlyPayments.Sum(p => p.Amount);
                var monthlyExpenses = monthlyIncome * 0.3m;

                monthlyData.Add(new MonthlyFinancialDto
                {
                    Month = date.ToString("MMM yyyy"),
                    Income = (double)monthlyIncome,
                    Expenses = (double)monthlyExpenses
                });
            }

            return new FinancialSummaryDto
            {
                TotalIncome = (double)totalIncome,
                TotalExpenses = (double)totalExpenses,
                NetProfit = (double)netProfit,
                MonthlyData = monthlyData
            };
        }
    }
}