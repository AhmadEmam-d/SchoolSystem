// Infrastructure/BackgroundServices/MonthlyInvoiceGenerator.cs
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SchoolSystem.Application.Features.Invoices.Commands.GenerateMonthlyFees;
using SchoolSystem.Application.Features.Invoices.DTOs;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Infrastructure.Services
{
    public class MonthlyInvoiceGenerator : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<MonthlyInvoiceGenerator> _logger;

        public MonthlyInvoiceGenerator(IServiceProvider serviceProvider, ILogger<MonthlyInvoiceGenerator> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                // Check if it's the first day of the month
                var now = DateTime.UtcNow;
                if (now.Day == 1 && now.Hour == 1) // Run at 1 AM on the 1st of each month
                {
                    try
                    {
                        using var scope = _serviceProvider.CreateScope();
                        var mediator = scope.ServiceProvider.GetRequiredService<IMediator>();

                        var previousMonth = now.AddMonths(-1);
                        var dto = new GenerateMonthlyFeesDto
                        {
                            Year = previousMonth.Year,
                            Month = previousMonth.Month,
                            BaseAmount = 1200
                        };

                        var result = await mediator.Send(new GenerateMonthlyFeesCommand { Dto = dto }, stoppingToken);
                        _logger.LogInformation("Generated {Count} invoices for {Month}/{Year}",
                            result.Generated, previousMonth.Month, previousMonth.Year);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error generating monthly invoices");
                    }

                    // Wait 24 hours before checking again
                    await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
                }

                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
        }
    }
}