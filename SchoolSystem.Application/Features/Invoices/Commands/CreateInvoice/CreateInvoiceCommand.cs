// Application/Features/Invoices/Commands/CreateInvoice/CreateInvoiceCommand.cs
using MediatR;
using SchoolSystem.Application.Features.Invoices.DTOs;
using System;

namespace SchoolSystem.Application.Features.Invoices.Commands.CreateInvoice
{
    public class CreateInvoiceCommand : IRequest<Guid>
    {
        public CreateInvoiceDto Dto { get; set; }

        public CreateInvoiceCommand(CreateInvoiceDto dto)
        {
            Dto = dto;
        }
    }
}