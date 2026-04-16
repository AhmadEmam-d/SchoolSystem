// API/Controllers/HelpSupportController.cs
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Application.Features.HelpSupport.Commands.CreateTicket;
using SchoolSystem.Application.Features.HelpSupport.DTOs;
using SchoolSystem.Application.Features.HelpSupport.Queries.GetArticleById;
using SchoolSystem.Application.Features.HelpSupport.Queries.GetFAQs;
using SchoolSystem.Application.Features.HelpSupport.Queries.GetKnowledgeBase;
using SchoolSystem.Application.Features.HelpSupport.Queries.GetMyTickets;
using SchoolSystem.Application.Interfaces.Services;
using System.Security.Claims;

namespace SchoolSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class HelpSupportController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;

        public HelpSupportController(IMediator mediator, IMessageService messageService)
        {
            _mediator = mediator;
            _messageService = messageService;
        }

        [HttpGet("faqs")]
        public async Task<IActionResult> GetFAQs([FromQuery] string? category, [FromQuery] string? search)
        {
            var query = new GetFAQsQuery { Category = category, SearchTerm = search };
            var result = await _mediator.Send(query);
            return Ok(ApiResponseFactory.Success(result, "FAQsFetchedSuccessfully", _messageService));
        }

        [HttpGet("knowledge-base")]
        public async Task<IActionResult> GetKnowledgeBase([FromQuery] string? category)
        {
            var query = new GetKnowledgeBaseQuery { Category = category };
            var result = await _mediator.Send(query);
            return Ok(ApiResponseFactory.Success(result, "KnowledgeBaseFetchedSuccessfully", _messageService));
        }

        [HttpGet("knowledge-base/{id}")]
        public async Task<IActionResult> GetArticleById(Guid id)
        {
            var query = new GetArticleByIdQuery(id);
            var result = await _mediator.Send(query);
            return Ok(ApiResponseFactory.Success(result, "ArticleFetchedSuccessfully", _messageService));
        }

        [HttpPost("tickets")]
        public async Task<IActionResult> CreateTicket([FromBody] CreateTicketDto ticketDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var userRoleClaim = User.FindFirst(ClaimTypes.Role);

            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized();

            var userRole = userRoleClaim?.Value ?? "User";
            var command = new CreateTicketCommand { Ticket = ticketDto, UserId = userId, UserRole = userRole };
            var ticketId = await _mediator.Send(command);

            return Ok(ApiResponseFactory.Success(ticketId, "TicketCreatedSuccessfully", _messageService));
        }

        [HttpGet("my-tickets")]
        public async Task<IActionResult> GetMyTickets()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized();

            var query = new GetMyTicketsQuery(userId);
            var result = await _mediator.Send(query);
            return Ok(ApiResponseFactory.Success(result, "TicketsFetchedSuccessfully", _messageService));
        }
    }
}