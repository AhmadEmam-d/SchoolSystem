using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Exams.Commands.Create;
using SchoolSystem.Application.Features.Exams.Commands.Delete;
using SchoolSystem.Application.Features.Exams.Commands.Update;
using SchoolSystem.Application.Features.Exams.Commands.CreateResult;
using SchoolSystem.Application.Features.Exams.Commands.UpdateResult;
using SchoolSystem.Application.Features.Exams.Commands.DeleteResult;
using SchoolSystem.Application.Features.Exams.DTOs;
using SchoolSystem.Application.Features.Exams.Queries.GetAll;
using SchoolSystem.Application.Features.Exams.Queries.GetById;
using SchoolSystem.Application.Features.Exams.Queries.GetResults;
using SchoolSystem.Application.Features.Exams.Queries.GetSummary;
using SchoolSystem.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ExamsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;

        public ExamsController(IMediator mediator, IMessageService messageService)
        {
            _mediator = mediator;
            _messageService = messageService;
        }

        // GET: api/Exams/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            try
            {
                var result = await _mediator.Send(new GetExamsSummaryQuery());
                return Ok(ApiResponseFactory.Success(result, "ExamsSummaryFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ExamsSummaryFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // GET: api/Exams
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] Guid? subjectOid, [FromQuery] Guid? classOid, [FromQuery] int? status, [FromQuery] int? type)
        {
            try
            {
                var result = await _mediator.Send(new GetExamsQuery
                {
                    SubjectOid = subjectOid,
                    ClassOid = classOid,
                    Status = status,
                    Type = type
                });
                return Ok(ApiResponseFactory.Success(result, "ExamsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ExamsFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // GET: api/Exams/{oid}
        [HttpGet("{oid}")]
        public async Task<IActionResult> GetById(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new GetExamByIdQuery(oid));
                if (result == null)
                    return NotFound();

                return Ok(ApiResponseFactory.Success(result, "ExamFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ExamFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // GET: api/Exams/{oid}/results
        [HttpGet("{oid}/results")]
        public async Task<IActionResult> GetResults(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new GetExamResultsQuery(oid));
                return Ok(ApiResponseFactory.Success(result, "ExamResultsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ExamResultsFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // POST: api/Exams
        [HttpPost]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> Create([FromBody] CreateExamDto dto)
        {
            try
            {
                var result = await _mediator.Send(new CreateExamCommand(dto));
                return Ok(ApiResponseFactory.Success(result, "ExamCreatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ExamCreationFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // PUT: api/Exams/{oid}
        [HttpPut("{oid}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> Update(Guid oid, [FromBody] UpdateExamDto dto)
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

                var result = await _mediator.Send(new UpdateExamCommand(dto));
                return Ok(ApiResponseFactory.Success(result, "ExamUpdatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ExamUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // DELETE: api/Exams/{oid}
        [HttpDelete("{oid}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> Delete(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new DeleteExamCommand(oid));
                return Ok(ApiResponseFactory.Success(result, "ExamDeletedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ExamDeletionFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // POST: api/Exams/{oid}/results
        [HttpPost("{oid}/results")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> AddResult(Guid oid, [FromBody] CreateExamResultDto dto)
        {
            try
            {
                if (oid != dto.ExamOid)
                {
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "IDMismatch", _messageService,
                        new List<string> { "Exam ID mismatch" }
                    ));
                }

                var result = await _mediator.Send(new CreateExamResultCommand(dto));
                return Ok(ApiResponseFactory.Success(result, "ExamResultAddedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ExamResultAddFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // PUT: api/Exams/results/{oid}
        [HttpPut("results/{oid}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> UpdateResult(Guid oid, [FromBody] UpdateExamResultDto dto)
        {
            try
            {
                if (oid != dto.Oid)
                {
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "IDMismatch", _messageService,
                        new List<string> { "Result ID mismatch" }
                    ));
                }

                var result = await _mediator.Send(new UpdateExamResultCommand(dto));
                return Ok(ApiResponseFactory.Success(result, "ExamResultUpdatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ExamResultUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // DELETE: api/Exams/results/{oid}
        [HttpDelete("results/{oid}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> DeleteResult(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new DeleteExamResultCommand(oid));
                return Ok(ApiResponseFactory.Success(result, "ExamResultDeletedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ExamResultDeletionFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
    }
}