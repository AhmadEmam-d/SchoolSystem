using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Announcements.Commands.Create;
using SchoolSystem.Application.Features.Announcements.Commands.Delete;
using SchoolSystem.Application.Features.Announcements.Commands.Update;
using SchoolSystem.Application.Features.Announcements.DTOs;
using SchoolSystem.Application.Features.Announcements.Queries.GetAll;
using SchoolSystem.Application.Features.Announcements.Queries.GetById;
using SchoolSystem.Application.Features.Announcements.Queries.GetByPriority;
using SchoolSystem.Application.Features.Announcements.Queries.GetByTarget;
using SchoolSystem.Application.Features.Announcements.Queries.GetSummary;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AnnouncementsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;

        public AnnouncementsController(IMediator mediator, IMessageService messageService)
        {
            _mediator = mediator;
            _messageService = messageService;
        }

        // GET: api/Announcements/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            try
            {
                var result = await _mediator.Send(new GetAnnouncementSummaryQuery());
                return Ok(ApiResponseFactory.Success(result, "AnnouncementsSummaryFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AnnouncementsSummaryFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // GET: api/Announcements
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? target, [FromQuery] int? priority, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate, [FromQuery] string? search)
        {
            try
            {
                var result = await _mediator.Send(new GetAnnouncementsQuery
                {
                    Target = target.HasValue ? (AnnouncementTarget)target.Value : null,
                    Priority = priority.HasValue ? (AnnouncementPriority)priority.Value : null,
                    FromDate = fromDate,
                    ToDate = toDate,
                    Search = search
                });
                return Ok(ApiResponseFactory.Success(result, "AnnouncementsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AnnouncementsFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // GET: api/Announcements/target/{target}
        [HttpGet("target/{target}")]
        public async Task<IActionResult> GetByTarget(string target, [FromQuery] int? take)
        {
            try
            {
                var result = await _mediator.Send(new GetAnnouncementsByTargetQuery
                {
                    Target = (AnnouncementTarget)Enum.Parse(typeof(AnnouncementTarget), target),
                    Take = take
                });
                return Ok(ApiResponseFactory.Success(result, "AnnouncementsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AnnouncementsFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // GET: api/Announcements/priority/{priority}
        [HttpGet("priority/{priority}")]
        public async Task<IActionResult> GetByPriority(string priority, [FromQuery] int? take)
        {
            try
            {
                var result = await _mediator.Send(new GetAnnouncementsByPriorityQuery
                {
                    Priority = (AnnouncementPriority)Enum.Parse(typeof(AnnouncementPriority), priority),
                    Take = take
                });
                return Ok(ApiResponseFactory.Success(result, "AnnouncementsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AnnouncementsFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // GET: api/Announcements/{oid}
        [HttpGet("{oid}")]
        public async Task<IActionResult> GetById(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new GetAnnouncementByIdQuery(oid));
                if (result == null)
                    return NotFound();

                return Ok(ApiResponseFactory.Success(result, "AnnouncementFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AnnouncementFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // POST: api/Announcements
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateAnnouncementDto dto)
        {
            try
            {
                var result = await _mediator.Send(new CreateAnnouncementCommand(dto));
                return Ok(ApiResponseFactory.Success(result, "AnnouncementCreatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AnnouncementCreationFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // PUT: api/Announcements/{oid}
        [HttpPut("{oid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid oid, [FromBody] UpdateAnnouncementDto dto)
        {
            try
            {
                if (oid != dto.Oid)
                {
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "IDMismatch", _messageService,
                        new List<string> { "ID mismatch between URL and body." }
                    ));
                }

                var result = await _mediator.Send(new UpdateAnnouncementCommand(dto));
                return Ok(ApiResponseFactory.Success(result, "AnnouncementUpdatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AnnouncementUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // DELETE: api/Announcements/{oid}
        [HttpDelete("{oid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new DeleteAnnouncementCommand(oid));
                return Ok(ApiResponseFactory.Success(result, "AnnouncementDeletedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AnnouncementDeletionFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
    }
}