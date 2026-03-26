using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Timetable.Commands.Create;
using SchoolSystem.Application.Features.Timetable.Commands.Delete;
using SchoolSystem.Application.Features.Timetable.Commands.Update;
using SchoolSystem.Application.Features.Timetable.DTOs;
using SchoolSystem.Application.Features.Timetable.Queries.GetAll;
using SchoolSystem.Application.Features.Timetable.Queries.GetById;
using SchoolSystem.Application.Features.Timetable.Queries.GetTimetableByClass;
using SchoolSystem.Application.Features.Timetable.Queries.GetTimeTableByTeacher;
using SchoolSystem.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TimetableController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;

        public TimetableController(IMediator mediator, IMessageService messageService)
        {
            _mediator = mediator;
            _messageService = messageService;
        }

        // GET: api/Timetable
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _mediator.Send(new GetAllTimetablesQuery());
                return Ok(ApiResponseFactory.Success(result, "TimetablesFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "TimetablesFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // GET: api/Timetable/teacher/{teacherOid}
        [HttpGet("teacher/{teacherOid}")]
        public async Task<IActionResult> GetByTeacher(Guid teacherOid)
        {
            try
            {
                var result = await _mediator.Send(new GetTimetableByTeacherQuery(teacherOid));
                return Ok(ApiResponseFactory.Success(result, "TimetableFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "TimetableFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // GET: api/Timetable/class/{classOid}
        [HttpGet("class/{classOid}")]
        public async Task<IActionResult> GetByClass(Guid classOid)
        {
            try
            {
                var result = await _mediator.Send(new GetTimetableByClassQuery(classOid));
                return Ok(ApiResponseFactory.Success(result, "TimetableFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "TimetableFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // GET: api/Timetable/{oid}
        [HttpGet("{oid}")]
        public async Task<IActionResult> GetById(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new GetTimetableByOidQuery(oid));
                if (result == null)
                    return NotFound();

                return Ok(ApiResponseFactory.Success(result, "TimetableFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "TimetableFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // POST: api/Timetable
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateTimetableDto dto)
        {
            try
            {
                var result = await _mediator.Send(new CreateTimetableCommand(dto));
                return Ok(ApiResponseFactory.Success(result, "TimetableCreatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "TimetableCreationFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // PUT: api/Timetable/{oid}
        [HttpPut("{oid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(Guid oid, [FromBody] UpdateTimetableDto dto)
        {
            try
            {
                if (oid != dto.Oid)
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Errors = new List<string> { "ID mismatch between URL and body." }
                    });
                }

                var result = await _mediator.Send(new UpdateTimetableCommand(dto));
                return Ok(ApiResponseFactory.Success(result, "TimetableUpdatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "TimetableUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // DELETE: api/Timetable/{oid}
        [HttpDelete("{oid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new DeleteTimetableCommand(oid));
                return Ok(ApiResponseFactory.Success(result, "TimetableDeletedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "TimetableDeletionFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
    }
}