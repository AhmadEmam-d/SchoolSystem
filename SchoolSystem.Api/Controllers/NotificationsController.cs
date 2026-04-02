using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Notifications.Commands.Delete;
using SchoolSystem.Application.Features.Notifications.Commands.MarkAllRead;
using SchoolSystem.Application.Features.Notifications.Commands.MarkRead;
using SchoolSystem.Application.Features.Notifications.Commands.Send;
using SchoolSystem.Application.Features.Notifications.DTOs;
using SchoolSystem.Application.Features.Notifications.Queries.GetSummary;
using SchoolSystem.Application.Features.Notifications.Queries.GetUser;
using SchoolSystem.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;

        public NotificationsController(IMediator mediator, IMessageService messageService)
        {
            _mediator = mediator;
            _messageService = messageService;
        }

        // GET: api/Notifications/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            try
            {
                var result = await _mediator.Send(new GetNotificationSummaryQuery());
                return Ok(ApiResponseFactory.Success(result, "NotificationsSummaryFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "NotificationsSummaryFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // GET: api/Notifications
        [HttpGet]
        public async Task<IActionResult> GetUserNotifications([FromQuery] bool? isRead, [FromQuery] string? type, [FromQuery] int? take)
        {
            try
            {
                var result = await _mediator.Send(new GetUserNotificationsQuery { IsRead = isRead, Type = type, Take = take });
                return Ok(ApiResponseFactory.Success(result, "NotificationsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "NotificationsFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // POST: api/Notifications
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SendNotification([FromBody] CreateNotificationDto dto)
        {
            try
            {
                var result = await _mediator.Send(new SendNotificationCommand(dto));
                return Ok(ApiResponseFactory.Success(result, "NotificationSentSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "NotificationSendFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // PUT: api/Notifications/{oid}/read
        [HttpPut("{oid}/read")]
        public async Task<IActionResult> MarkAsRead(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new MarkNotificationAsReadCommand(oid));
                return Ok(ApiResponseFactory.Success(result, "NotificationMarkedAsReadSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "NotificationMarkReadFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // PUT: api/Notifications/read-all
        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            try
            {
                var result = await _mediator.Send(new MarkAllNotificationsAsReadCommand());
                return Ok(ApiResponseFactory.Success(result, "AllNotificationsMarkedAsReadSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "NotificationsMarkAllReadFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // DELETE: api/Notifications/{oid}
        [HttpDelete("{oid}")]
        public async Task<IActionResult> Delete(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new DeleteNotificationCommand(oid));
                return Ok(ApiResponseFactory.Success(result, "NotificationDeletedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "NotificationDeleteFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
    }
}