using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Attendance.Commands.Create;
using SchoolSystem.Application.Features.Attendance.Commands.Delete;
using SchoolSystem.Application.Features.Attendance.Commands.Update;
using SchoolSystem.Application.Features.Attendance.DTOs;
using SchoolSystem.Application.Features.Attendance.Queries.GetAll;
using SchoolSystem.Application.Features.Attendance.Queries.GetById;
using SchoolSystem.Application.Features.Attendance.Queries.GetMonthlyReport;
using SchoolSystem.Application.Features.Attendance.Queries.GetToday;
using SchoolSystem.Application.Features.Attendance.Queries.GetWeekly;
using SchoolSystem.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;

        public AttendanceController(IMediator mediator, IMessageService messageService)
        {
            _mediator = mediator;
            _messageService = messageService;
        }

        [HttpGet("today")]
        public async Task<IActionResult> GetToday([FromQuery] Guid? classOid)
        {
            try
            {
                var result = await _mediator.Send(new GetTodayAttendanceQuery { ClassOid = classOid });
                return Ok(ApiResponseFactory.Success(result, "TodayAttendanceFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AttendanceFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpGet("weekly")]
        public async Task<IActionResult> GetWeekly([FromQuery] Guid? classOid, [FromQuery] DateTime? startDate)
        {
            try
            {
                var result = await _mediator.Send(new GetWeeklyAttendanceQuery { ClassOid = classOid, StartDate = startDate });
                return Ok(ApiResponseFactory.Success(result, "WeeklyAttendanceFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AttendanceFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpGet("monthly-report")]
        public async Task<IActionResult> GetMonthlyReport([FromQuery] int? year, [FromQuery] int? month, [FromQuery] Guid? classOid)
        {
            try
            {
                var result = await _mediator.Send(new GetMonthlyAttendanceReportQuery { Year = year, Month = month, ClassOid = classOid });
                return Ok(ApiResponseFactory.Success(result, "MonthlyReportFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ReportFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] Guid? classOid, [FromQuery] DateTime? date)
        {
            try
            {
                var result = await _mediator.Send(new GetAllAttendancesQuery { ClassOid = classOid, Date = date });
                return Ok(ApiResponseFactory.Success(result, "AttendancesFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AttendancesFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpGet("{oid}")]
        public async Task<IActionResult> GetById(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new GetAttendanceByIdQuery(oid));
                if (result == null)
                    return NotFound();

                return Ok(ApiResponseFactory.Success(result, "AttendanceFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AttendanceFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> Create([FromBody] CreateAttendanceDto dto)
        {
            try
            {
                var result = await _mediator.Send(new CreateAttendanceCommand(dto));
                return Ok(ApiResponseFactory.Success(result, "AttendanceCreatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AttendanceCreationFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpPut("{oid}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> Update(Guid oid, [FromBody] UpdateAttendanceDto dto)
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

                var result = await _mediator.Send(new UpdateAttendanceCommand(dto));
                return Ok(ApiResponseFactory.Success(result, "AttendanceUpdatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AttendanceUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpDelete("{oid}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> Delete(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new DeleteAttendanceCommand(oid));
                return Ok(ApiResponseFactory.Success(result, "AttendanceDeletedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "AttendanceDeletionFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
    }
}