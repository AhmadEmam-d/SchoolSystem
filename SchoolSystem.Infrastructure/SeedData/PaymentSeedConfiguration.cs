// Infrastructure/SeedData/PaymentSeedData.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using System;

namespace SchoolSystem.Infrastructure.SeedData
{
    public class PaymentSeedConfiguration : IEntityTypeConfiguration<FeeInvoice>
    {
        public void Configure(EntityTypeBuilder<FeeInvoice> builder)
        {
            var parentOid = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var bartOid = Guid.Parse("22222222-2222-2222-2222-222222222222");
            var lisaOid = Guid.Parse("33333333-3333-3333-3333-333333333333");

            builder.HasData(
                // Bart's Invoices
                new FeeInvoice
                {
                    Oid = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                    InvoiceNumber = "INV-2026-001",
                    Title = "Tuition Fee - March 2026",
                    Category = "Tuition",
                    Description = "Monthly tuition fee for March 2026",
                    Amount = 1200,
                    PaidAmount = 1200,
                    RemainingAmount = 0,
                    DueDate = new DateTime(2026, 3, 1),
                    PaidDate = new DateTime(2026, 2, 28),
                    Status = PaymentStatus.Paid,
                    ReceiptNumber = "RCP-20260228-ABC123",
                    PaymentMethod = "Credit Card",
                    CardLastFour = "3456",
                    TransactionId = "TXN-20260228-001",
                    StudentId = bartOid,
                    CreatedAt = new DateTime(2026, 2, 20),
                    IsDeleted = false
                },
                new FeeInvoice
                {
                    Oid = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                    InvoiceNumber = "INV-2026-002",
                    Title = "Tuition Fee - April 2026",
                    Category = "Tuition",
                    Description = "Monthly tuition fee for April 2026",
                    Amount = 1200,
                    PaidAmount = 0,
                    RemainingAmount = 1200,
                    DueDate = new DateTime(2026, 4, 1),
                    Status = PaymentStatus.Pending,
                    StudentId = bartOid,
                    CreatedAt = new DateTime(2026, 3, 1),
                    IsDeleted = false
                },
                new FeeInvoice
                {
                    Oid = Guid.Parse("66666666-6666-6666-6666-666666666666"),
                    InvoiceNumber = "INV-2026-003",
                    Title = "Science Lab Fee",
                    Category = "Lab Fee",
                    Description = "Science laboratory materials fee",
                    Amount = 150,
                    PaidAmount = 0,
                    RemainingAmount = 150,
                    DueDate = new DateTime(2026, 3, 15),
                    Status = PaymentStatus.Pending,
                    StudentId = bartOid,
                    CreatedAt = new DateTime(2026, 3, 1),
                    IsDeleted = false
                },
                new FeeInvoice
                {
                    Oid = Guid.Parse("77777777-7777-7777-7777-777777777777"),
                    InvoiceNumber = "INV-2026-004",
                    Title = "School Trip - Pyramids",
                    Category = "Activity",
                    Description = "Educational trip to Pyramids",
                    Amount = 75,
                    PaidAmount = 0,
                    RemainingAmount = 75,
                    DueDate = new DateTime(2026, 3, 10),
                    Status = PaymentStatus.Overdue,
                    StudentId = bartOid,
                    CreatedAt = new DateTime(2026, 3, 1),
                    IsDeleted = false
                },
                new FeeInvoice
                {
                    Oid = Guid.Parse("88888888-8888-8888-8888-888888888888"),
                    InvoiceNumber = "INV-2026-005",
                    Title = "School Supplies",
                    Category = "Supplies",
                    Description = "Books and stationery",
                    Amount = 255,
                    PaidAmount = 255,
                    RemainingAmount = 0,
                    DueDate = new DateTime(2026, 2, 15),
                    PaidDate = new DateTime(2026, 2, 10),
                    Status = PaymentStatus.Paid,
                    ReceiptNumber = "RCP-20260210-DEF456",
                    PaymentMethod = "Credit Card",
                    CardLastFour = "3456",
                    TransactionId = "TXN-20260210-002",
                    StudentId = bartOid,
                    CreatedAt = new DateTime(2026, 2, 5),
                    IsDeleted = false
                },
                // Lisa's Invoices
                new FeeInvoice
                {
                    Oid = Guid.Parse("99999999-9999-9999-9999-999999999999"),
                    InvoiceNumber = "INV-2026-006",
                    Title = "Tuition Fee - March 2026",
                    Category = "Tuition",
                    Description = "Monthly tuition fee for March 2026",
                    Amount = 1200,
                    PaidAmount = 1200,
                    RemainingAmount = 0,
                    DueDate = new DateTime(2026, 3, 1),
                    PaidDate = new DateTime(2026, 2, 28),
                    Status = PaymentStatus.Paid,
                    ReceiptNumber = "RCP-20260228-GHI789",
                    PaymentMethod = "Credit Card",
                    CardLastFour = "3456",
                    TransactionId = "TXN-20260228-003",
                    StudentId = lisaOid,
                    CreatedAt = new DateTime(2026, 2, 20),
                    IsDeleted = false
                }
            );
        }
    }
}