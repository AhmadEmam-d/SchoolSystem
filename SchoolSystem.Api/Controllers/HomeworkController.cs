using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Homeworks.Commands.Create;
using SchoolSystem.Application.Features.Homeworks.Commands.Delete;
using SchoolSystem.Application.Features.Homeworks.Commands.Update;
using SchoolSystem.Application.Features.Homeworks.DTOs;
using SchoolSystem.Application.Features.Homeworks.DTOs.Update;
using SchoolSystem.Application.Features.Homeworks.Queries.GetById;
using SchoolSystem.Application.Features.Homeworks.Queries.GetGradeReport;
using SchoolSystem.Application.Features.Homeworks.Queries.GetSubmissions;
using SchoolSystem.Application.Features.Homeworks.Queries.GetTeacherHomeworks;
using SchoolSystem.Application.Interfaces.Services;
using System.Security.Claims;

namespace SchoolSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class HomeworksController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;

        public HomeworksController(IMediator mediator, IMessageService messageService)
        {
            _mediator = mediator;
            _messageService = messageService;
        }

        //// GET: api/Homeworks
        //[HttpGet]
        //[Authorize(Roles = "Teacher,Admin")]
        //public async Task<IActionResult> GetAll()
        //{
        //    try
        //    {
        //        var result = await _mediator.Send(new GetAllHomeworksQuery());
        //        return Ok(ApiResponseFactory.Success(result, "AllHomeworksFetchedSuccessfully", _messageService));
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ApiResponseFactory.Failure<object>(
        //            "HomeworksFetchFailed", _messageService,
        //            new List<string> { ex.Message }
        //        ));
        //    }
        //

        // GET: api/Homeworks/teacher
        [HttpGet("teacher")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> GetTeacherHomeworks()
        {
            var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (teacherIdClaim == null || !Guid.TryParse(teacherIdClaim.Value, out var teacherId))
                return Unauthorized();

            var result = await _mediator.Send(new GetTeacherHomeworksQuery(teacherId));
            return Ok(ApiResponseFactory.Success(result, "HomeworksFetchedSuccessfully", _messageService));
        }

        // GET: api/Homeworks/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _mediator.Send(new GetHomeworkByIdQuery(id));
            return Ok(ApiResponseFactory.Success(result, "HomeworkFetchedSuccessfully", _messageService));
        }

        // GET: api/Homeworks/{id}/submissions
        [HttpGet("{id:guid}/submissions")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> GetSubmissions(Guid id)
        {
            var result = await _mediator.Send(new GetHomeworkSubmissionsQuery(id));
            return Ok(ApiResponseFactory.Success(result, "SubmissionsFetchedSuccessfully", _messageService));
        }

        // GET: api/Homeworks/{id}/grade-report
        [HttpGet("{id:guid}/grade-report")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> GetGradeReport(Guid id)
        {
            var result = await _mediator.Send(new GetHomeworkGradeReportQuery(id));
            return Ok(ApiResponseFactory.Success(result, "GradeReportFetchedSuccessfully", _messageService));
        }

        // POST: api/Homeworks
        [HttpPost]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateHomeworkDto dto)
        {
            var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (teacherIdClaim == null || !Guid.TryParse(teacherIdClaim.Value, out var teacherId))
                return Unauthorized();

            var result = await _mediator.Send(new CreateHomeworkCommand(dto, teacherId));
            return Ok(ApiResponseFactory.Success(result, "HomeworkCreatedSuccessfully", _messageService));
        }

        // PUT: api/Homeworks/{id}
        [HttpPut("{id:guid}")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateHomeworkDto dto)
        {
            try
            {
                if (id != dto.Oid)
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Errors = new List<string> { "ID mismatch between URL and body." }
                    });
                }

                var command = new UpdateHomeworkCommand(id, dto);
                var result = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(result, "HomeworkUpdatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "HomeworkUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // DELETE: api/Homeworks/{id}
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var command = new DeleteHomeworkCommand(id);
                var result = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(result, "HomeworkDeletedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "HomeworkDeletionFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
    }
}