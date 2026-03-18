using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Notifications.Commands.Create;
using SchoolSystem.Application.Features.Notifications.Commands.Delete;
using SchoolSystem.Application.Features.Notifications.Commands.Update;
using SchoolSystem.Application.Features.Notifications.Dtos.Create;
using SchoolSystem.Application.Features.Notifications.Queries.GetAll;
using SchoolSystem.Application.Features.Notifications.Queries.GetById;
using SchoolSystem.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // يتطلب تسجيل الدخول
    public class NotificationsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;

        public NotificationsController(IMediator mediator, IMessageService messageService)
        {
            _mediator = mediator;
            _messageService = messageService;
        }

        // GET: api/Notifications
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] Guid? userOid)
        {
            try
            {
                var query = new GetAllNotificationsQuery { UserOid = userOid };
                var result = await _mediator.Send(query);

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

        // GET: api/Notifications/{oid}
        [HttpGet("{oid}")]
        public async Task<IActionResult> GetById(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new GetNotificationByOidQuery(oid));

                if (result == null)
                    return NotFound(ApiResponseFactory.Failure<object>(
                        "NotificationNotFound", _messageService,
                        new List<string> { "Notification not found" }
                    ));

                return Ok(ApiResponseFactory.Success(result, "NotificationFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "NotificationFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // POST: api/Notifications
        [HttpPost]
        [Authorize(Roles = "Admin")] // فقط Admin يقدر ينشئ إشعارات
        public async Task<IActionResult> Create([FromBody] CreateNotificationDto dto)
        {
            try
            {
                var result = await _mediator.Send(new CreateNotificationCommand(dto));

                return Ok(ApiResponseFactory.Success(result, "NotificationCreatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "NotificationCreationFailed", _messageService,
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
                var result = await _mediator.Send(new MarkAsReadCommand(oid));

                return Ok(ApiResponseFactory.Success(result, "NotificationMarkedAsReadSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "NotificationUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // DELETE: api/Notifications/{oid}
        [HttpDelete("{oid}")]
        [Authorize(Roles = "Admin")] // فقط Admin يقدر يحذف إشعارات
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
                    "NotificationDeletionFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
    }
}