using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Messages.Commands.Delete;
using SchoolSystem.Application.Features.Messages.Commands.MarkRead;
using SchoolSystem.Application.Features.Messages.Commands.Send;
using SchoolSystem.Application.Features.Messages.DTOs;
using SchoolSystem.Application.Features.Messages.Queries.GetById;
using SchoolSystem.Application.Features.Messages.Queries.GetConversations;
using SchoolSystem.Application.Features.Messages.Queries.GetSentMessages;
using SchoolSystem.Application.Features.Messages.Queries.GetSummary;
using SchoolSystem.Application.Features.Messages.Queries.GetUserMessages;
using SchoolSystem.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;

        public MessagesController(IMediator mediator, IMessageService messageService)
        {
            _mediator = mediator;
            _messageService = messageService;
        }

        // GET: api/Messages/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            try
            {
                var result = await _mediator.Send(new GetMessageSummaryQuery());
                return Ok(ApiResponseFactory.Success(result, "MessagesSummaryFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "MessagesSummaryFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // GET: api/Messages/inbox
        [HttpGet("inbox")]
        public async Task<IActionResult> GetInbox([FromQuery] bool? isRead)
        {
            try
            {
                var result = await _mediator.Send(new GetUserMessagesQuery { IsRead = isRead });
                return Ok(ApiResponseFactory.Success(result, "MessagesFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "MessagesFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // GET: api/Messages/sent
        [HttpGet("sent")]
        public async Task<IActionResult> GetSent()
        {
            try
            {
                var result = await _mediator.Send(new GetSentMessagesQuery());
                return Ok(ApiResponseFactory.Success(result, "SentMessagesFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SentMessagesFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // GET: api/Messages/conversations
        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations()
        {
            try
            {
                var result = await _mediator.Send(new GetConversationsQuery());
                return Ok(ApiResponseFactory.Success(result, "ConversationsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ConversationsFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // GET: api/Messages/{oid}
        [HttpGet("{oid}")]
        public async Task<IActionResult> GetById(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new GetMessageByIdQuery(oid));
                return Ok(ApiResponseFactory.Success(result, "MessageFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "MessageFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // POST: api/Messages
        [HttpPost]
        public async Task<IActionResult> Send([FromBody] CreateMessageDto dto)
        {
            try
            {
                var result = await _mediator.Send(new SendMessageCommand(dto));
                return Ok(ApiResponseFactory.Success(result, "MessageSentSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "MessageSendFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // PUT: api/Messages/{oid}/read
        [HttpPut("{oid}/read")]
        public async Task<IActionResult> MarkAsRead(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new MarkMessageAsReadCommand(oid));
                return Ok(ApiResponseFactory.Success(result, "MessageMarkedAsReadSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "MessageMarkReadFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // DELETE: api/Messages/{oid}
        [HttpDelete("{oid}")]
        public async Task<IActionResult> Delete(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new DeleteMessageCommand(oid));
                return Ok(ApiResponseFactory.Success(result, "MessageDeletedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "MessageDeleteFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
    }
}