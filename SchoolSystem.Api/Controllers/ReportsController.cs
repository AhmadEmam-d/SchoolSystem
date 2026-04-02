using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Reports.Commands.ArchiveReport;
using SchoolSystem.Application.Features.Reports.Commands.DeleteReport;
using SchoolSystem.Application.Features.Reports.Commands.GenerateFinancialReport;
using SchoolSystem.Application.Features.Reports.Commands.GenerateStudentReport;
using SchoolSystem.Application.Features.Reports.Commands.GenerateTeacherReport;
using SchoolSystem.Application.Features.Reports.DTOs;
using SchoolSystem.Application.Features.Reports.Queries.GetAcademicPerformance;
using SchoolSystem.Application.Features.Reports.Queries.GetAttendanceDistribution;
using SchoolSystem.Application.Features.Reports.Queries.GetFinancialSummary;
using SchoolSystem.Application.Features.Reports.Queries.GetGradesReport;
using SchoolSystem.Application.Features.Reports.Queries.GetStudentsSummary;
using SchoolSystem.Application.Features.Reports.Queries.GetTeacherActivityLog;
using SchoolSystem.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class ReportsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;

        public ReportsController(IMediator mediator, IMessageService messageService)
        {
            _mediator = mediator;
            _messageService = messageService;
        }

        // GET: api/Reports/students-summary
        [HttpGet("students-summary")]
        public async Task<IActionResult> GetStudentsSummary([FromQuery] Guid? classOid, [FromQuery] string? status)
        {
            try
            {
                var result = await _mediator.Send(new GetStudentsSummaryReportQuery { ClassOid = classOid, Status = status });
                return Ok(ApiResponseFactory.Success(result, "StudentsSummaryReportFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ReportFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // GET: api/Reports/grades
        [HttpGet("grades")]
        public async Task<IActionResult> GetGradesReport([FromQuery] Guid? classOid, [FromQuery] Guid? subjectOid)
        {
            try
            {
                var result = await _mediator.Send(new GetGradesReportQuery { ClassOid = classOid, SubjectOid = subjectOid });
                return Ok(ApiResponseFactory.Success(result, "GradesReportFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ReportFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // GET: api/Reports/academic-performance
        [HttpGet("academic-performance")]
        public async Task<IActionResult> GetAcademicPerformance([FromQuery] Guid? classOid)
        {
            try
            {
                var result = await _mediator.Send(new GetAcademicPerformanceQuery { ClassOid = classOid });
                return Ok(ApiResponseFactory.Success(result, "AcademicPerformanceFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ReportFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // GET: api/Reports/attendance-distribution
        [HttpGet("attendance-distribution")]
        public async Task<IActionResult> GetAttendanceDistribution([FromQuery] Guid? classOid, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
        {
            try
            {
                var result = await _mediator.Send(new GetAttendanceDistributionQuery { ClassOid = classOid, FromDate = fromDate, ToDate = toDate });
                return Ok(ApiResponseFactory.Success(result, "AttendanceDistributionFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ReportFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // GET: api/Reports/financial
        [HttpGet("financial")]
        public async Task<IActionResult> GetFinancialSummary([FromQuery] int? year)
        {
            try
            {
                var result = await _mediator.Send(new GetFinancialSummaryQuery { Year = year });
                return Ok(ApiResponseFactory.Success(result, "FinancialSummaryFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ReportFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // GET: api/Reports/teacher-activity
        [HttpGet("teacher-activity")]
        public async Task<IActionResult> GetTeacherActivityLog([FromQuery] Guid? teacherOid, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
        {
            try
            {
                var result = await _mediator.Send(new GetTeacherActivityLogQuery { TeacherOid = teacherOid, FromDate = fromDate, ToDate = toDate });
                return Ok(ApiResponseFactory.Success(result, "TeacherActivityLogFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ReportFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // POST: api/Reports/student
        [HttpPost("student")]
        public async Task<IActionResult> GenerateStudentReport([FromBody] CreateStudentReportDto dto)
        {
            try
            {
                var result = await _mediator.Send(new GenerateStudentReportCommand(dto));
                return Ok(ApiResponseFactory.Success(result, "StudentReportGeneratedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ReportGenerationFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // POST: api/Reports/teacher
        [HttpPost("teacher")]
        public async Task<IActionResult> GenerateTeacherReport([FromBody] CreateTeacherReportDto dto)
        {
            try
            {
                var result = await _mediator.Send(new GenerateTeacherReportCommand(dto));
                return Ok(ApiResponseFactory.Success(result, "TeacherReportGeneratedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "TeacherReportGenerationFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // POST: api/Reports/financial
        [HttpPost("financial")]
        public async Task<IActionResult> GenerateFinancialReport([FromBody] CreateFinancialReportDto dto)
        {
            try
            {
                var result = await _mediator.Send(new GenerateFinancialReportCommand(dto));
                return Ok(ApiResponseFactory.Success(result, "FinancialReportGeneratedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "FinancialReportGenerationFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // PUT: api/Reports/archive/{oid}
        [HttpPut("archive/{oid}")]
        public async Task<IActionResult> ArchiveReport(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new ArchiveReportCommand(oid));
                return Ok(ApiResponseFactory.Success(result, "ReportArchivedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ReportArchiveFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // DELETE: api/Reports/{oid}
        [HttpDelete("{oid}")]
        public async Task<IActionResult> DeleteReport(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new DeleteReportCommand(oid));
                return Ok(ApiResponseFactory.Success(result, "ReportDeletedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ReportDeleteFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
    }
}