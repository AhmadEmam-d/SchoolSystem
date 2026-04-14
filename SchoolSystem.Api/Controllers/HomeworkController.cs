using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Homeworks.Commands.Create;
using SchoolSystem.Application.Features.Homeworks.Commands.Delete;
using SchoolSystem.Application.Features.Homeworks.Commands.Update;
using SchoolSystem.Application.Features.Homeworks.DTOs.Create;
using SchoolSystem.Application.Features.Homeworks.DTOs.Update;
using SchoolSystem.Application.Features.Homeworks.Queries.Get;
using SchoolSystem.Application.Features.Homeworks.Queries.GetByOid;
using SchoolSystem.Application.Interfaces.Services;
using System.Security.Claims;

namespace SchoolSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Teacher,Admin")]
    public class HomeworkController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;

        public HomeworkController(IMediator mediator, IMessageService messageService)
        {
            _mediator = mediator;
            _messageService = messageService;
        }

        [HttpGet("my-homeworks")]
        public async Task<IActionResult> GetTeacherHomeworks()
        {
            try
            {
                var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (teacherIdClaim == null || !Guid.TryParse(teacherIdClaim.Value, out var teacherId))
                {
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "TeacherNotFound", _messageService,
                        new List<string> { "Teacher ID not found." }
                    ));
                }

                var query = new GetTeacherHomeworksQuery(teacherId);
                var result = await _mediator.Send(query);
                return Ok(ApiResponseFactory.Success(result, "HomeworksFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "HomeworksFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpPost("add")]
        public async Task<IActionResult> CreateHomework([FromBody] CreateHomeworksDto dto)
        {
            try
            {
                var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (teacherIdClaim == null || !Guid.TryParse(teacherIdClaim.Value, out var teacherId))
                {
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "TeacherNotFound", _messageService,
                        new List<string> { "Teacher ID not found." }
                    ));
                }

                var command = new CreateHomeworkCommand(dto, teacherId);
                var result = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(result, "HomeworkCreatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "HomeworkCreationFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteHomework(Guid id)
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

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetHomeworkById(Guid id)
        {
            try
            {
                var result = await _mediator.Send(new GetHomeworkByOidQuery(id));
                return Ok(ApiResponseFactory.Success(result, "HomeworkFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "HomeworkFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateHomework(Guid id, [FromBody] UpdateHomeworkDto dto)
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
    }
}