// API/Controllers/Admin/AdminInvoicesController.cs
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Application.Features.Invoices.Commands.BulkCreateInvoices;
using SchoolSystem.Application.Features.Invoices.Commands.CreateInvoice;
using SchoolSystem.Application.Features.Invoices.Commands.GenerateMonthlyFees;
using SchoolSystem.Application.Features.Invoices.DTOs;
using System.Threading.Tasks;

namespace SchoolSystem.API.Controllers
{
    [Route("api/admin/invoices")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminInvoicesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AdminInvoicesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// Create a single invoice for a student
        /// </summary>
        [HttpPost("create")]
        public async Task<IActionResult> CreateInvoice([FromBody] CreateInvoiceDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _mediator.Send(new CreateInvoiceCommand(dto));
            return Ok(new { invoiceId = result, message = "Invoice created successfully" });
        }

        /// <summary>
        /// Create invoices for multiple students at once
        /// </summary>
        [HttpPost("bulk-create")]
        public async Task<IActionResult> BulkCreateInvoices([FromBody] BulkCreateInvoicesDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _mediator.Send(new BulkCreateInvoicesCommand { Dto = dto });
            return Ok(result);
        }

        /// <summary>
        /// Generate monthly tuition fees for all active students
        /// </summary>
        [HttpPost("generate-monthly-fees")]
        public async Task<IActionResult> GenerateMonthlyFees([FromBody] GenerateMonthlyFeesDto dto)
        {
            if (dto.Year <= 0 || dto.Month < 1 || dto.Month > 12)
                return BadRequest("Invalid year or month");

            var result = await _mediator.Send(new GenerateMonthlyFeesCommand { Dto = dto });
            return Ok(result);
        }
    }
}