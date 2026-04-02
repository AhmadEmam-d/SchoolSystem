using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Reports.DTOs;
using SchoolSystem.Domain.Entities;
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
        private readonly IGenericRepository<FeePayment> _feePaymentRepo;
        private readonly IMapper _mapper;

        public GetFinancialSummaryQueryHandler(
            IGenericRepository<FeeInvoice> feeInvoiceRepo,
            IGenericRepository<FeePayment> feePaymentRepo,
            IMapper mapper)
        {
            _feeInvoiceRepo = feeInvoiceRepo;
            _feePaymentRepo = feePaymentRepo;
            _mapper = mapper;
        }

        public async Task<FinancialSummaryDto> Handle(GetFinancialSummaryQuery request, CancellationToken cancellationToken)
        {
            var invoices = await _feeInvoiceRepo.GetAllQueryable().ToListAsync(cancellationToken);
            var payments = await _feePaymentRepo.GetAllQueryable().ToListAsync(cancellationToken);

            var totalIncome = payments.Sum(p => p.Amount);
            var totalExpenses = totalIncome * 0.6m;
            var netProfit = totalIncome - totalExpenses;

            var monthlyData = new List<MonthlyFinancialDto>();
            for (int i = 1; i <= 12; i++)
            {
                monthlyData.Add(new MonthlyFinancialDto
                {
                    Month = new DateTime(DateTime.UtcNow.Year, i, 1).ToString("MMM"),
                    Income = (double)(totalIncome / 12),
                    Expenses = (double)(totalExpenses / 12)
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