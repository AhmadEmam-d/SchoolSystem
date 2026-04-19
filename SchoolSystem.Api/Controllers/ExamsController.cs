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
using SchoolSystem.Application.Features.Exams.Queries.GetTeacherExams;
using SchoolSystem.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Security.Claims;
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

        // GET: api/Exams/teacher
        [HttpGet("teacher")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> GetTeacherExams()
        {
            var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (teacherIdClaim == null || !Guid.TryParse(teacherIdClaim.Value, out var teacherId))
                return Unauthorized();

            var result = await _mediator.Send(new GetTeacherExamsQuery(teacherId));
            return Ok(ApiResponseFactory.Success(result, "TeacherExamsFetchedSuccessfully", _messageService));
        }

        // GET: api/Exams/summary
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var result = await _mediator.Send(new GetExamsSummaryQuery());
            return Ok(ApiResponseFactory.Success(result, "ExamsSummaryFetchedSuccessfully", _messageService));
        }

        // GET: api/Exams
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] Guid? subjectOid, [FromQuery] Guid? classOid, [FromQuery] int? status, [FromQuery] int? type)
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

        // GET: api/Exams/{oid}
        [HttpGet("{oid}")]
        public async Task<IActionResult> GetById(Guid oid)
        {
            var result = await _mediator.Send(new GetExamByIdQuery(oid));
            if (result == null)
                return NotFound();
            return Ok(ApiResponseFactory.Success(result, "ExamFetchedSuccessfully", _messageService));
        }

        // GET: api/Exams/{oid}/results
        [HttpGet("{oid}/results")]
        public async Task<IActionResult> GetResults(Guid oid)
        {
            var result = await _mediator.Send(new GetExamResultsQuery(oid));
            return Ok(ApiResponseFactory.Success(result, "ExamResultsFetchedSuccessfully", _messageService));
        }

        // POST: api/Exams
        [HttpPost]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> Create([FromBody] CreateExamDto dto)
        {
            var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (teacherIdClaim == null || !Guid.TryParse(teacherIdClaim.Value, out var teacherId))
                return Unauthorized();

            var result = await _mediator.Send(new CreateExamCommand(dto, teacherId));
            return Ok(ApiResponseFactory.Success(result, "ExamCreatedSuccessfully", _messageService));
        }

        // PUT: api/Exams/{oid}
        [HttpPut("{oid}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> Update(Guid oid, [FromBody] UpdateExamDto dto)
        {
            if (oid != dto.Oid)
                return BadRequest(new ApiResponse<bool> { Success = false, Errors = new List<string> { "ID mismatch" } });

            var result = await _mediator.Send(new UpdateExamCommand(dto));
            return Ok(ApiResponseFactory.Success(result, "ExamUpdatedSuccessfully", _messageService));
        }

        // DELETE: api/Exams/{oid}
        [HttpDelete("{oid}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> Delete(Guid oid)
        {
            var result = await _mediator.Send(new DeleteExamCommand(oid));
            return Ok(ApiResponseFactory.Success(result, "ExamDeletedSuccessfully", _messageService));
        }

        // POST: api/Exams/{oid}/results
        [HttpPost("{oid}/results")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> AddResult(Guid oid, [FromBody] CreateExamResultDto dto)
        {
            if (oid != dto.ExamOid)
                return BadRequest(new ApiResponse<bool> { Success = false, Errors = new List<string> { "Exam ID mismatch" } });

            var result = await _mediator.Send(new CreateExamResultCommand(dto));
            return Ok(ApiResponseFactory.Success(result, "ExamResultAddedSuccessfully", _messageService));
        }

        // PUT: api/Exams/results/{oid}
        [HttpPut("results/{oid}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> UpdateResult(Guid oid, [FromBody] UpdateExamResultDto dto)
        {
            if (oid != dto.Oid)
                return BadRequest(new ApiResponse<bool> { Success = false, Errors = new List<string> { "Result ID mismatch" } });

            var result = await _mediator.Send(new UpdateExamResultCommand(dto));
            return Ok(ApiResponseFactory.Success(result, "ExamResultUpdatedSuccessfully", _messageService));
        }

        // DELETE: api/Exams/results/{oid}
        [HttpDelete("results/{oid}")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> DeleteResult(Guid oid)
        {
            var result = await _mediator.Send(new DeleteExamResultCommand(oid));
            return Ok(ApiResponseFactory.Success(result, "ExamResultDeletedSuccessfully", _messageService));
        }
    }
}