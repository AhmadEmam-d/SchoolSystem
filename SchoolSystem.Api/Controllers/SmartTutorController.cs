using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Application.Features.SmartTutor.Commands.Chat;
using SchoolSystem.Application.Features.SmartTutor.DTOs;
using SchoolSystem.Application.Features.SmartTutor.Queries.GetConversations;
using SchoolSystem.Application.Interfaces.Services;
using System.Security.Claims;

namespace SchoolSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SmartTutorController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;

        public SmartTutorController(IMediator mediator, IMessageService messageService)
        {
            _mediator = mediator;
            _messageService = messageService;
        }

        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] SmartTutorRequestDto request)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                var userRoleClaim = User.FindFirst(ClaimTypes.Role);

                if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                {
                    return Unauthorized();
                }

                var userRole = userRoleClaim?.Value ?? "Student";
                var command = new SmartTutorChatCommand(request, userId, userRole);
                var result = await _mediator.Send(command);

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                {
                    return Unauthorized();
                }

                var query = new GetConversationsQuery { UserId = userId };
                var result = await _mediator.Send(query);

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }
    }
}