// API/Controllers/LessonsController.cs
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Lessons.Commands.Create;
using SchoolSystem.Application.Features.Lessons.Commands.Delete;
using SchoolSystem.Application.Features.Lessons.Commands.Update;
using SchoolSystem.Application.Features.Lessons.DTOs;
using SchoolSystem.Application.Features.Lessons.DTOs.Create;
using SchoolSystem.Application.Features.Lessons.Queries.Get;
using SchoolSystem.Application.Features.Lessons.Queries.GetAll;
using SchoolSystem.Application.Features.Lessons.Queries.GetById;
using SchoolSystem.Application.Features.Lessons.Queries.GetByOid;
using SchoolSystem.Application.Features.Lessons.Queries.GetStats;
using SchoolSystem.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SchoolSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Teacher,Admin")]
    public class LessonsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;

        public LessonsController(IMediator mediator, IMessageService messageService)
        {
            _mediator = mediator;
            _messageService = messageService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] GetAllLessonsQuery query)
        {
            try
            {
                var result = await _mediator.Send(query);
                return Ok(ApiResponseFactory.Success(result, "LessonsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "LessonsFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var result = await _mediator.Send(new GetLessonByIdQuery(id));
                return Ok(ApiResponseFactory.Success(result, "LessonFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "LessonFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching the lesson." }
                ));
            }
        }

        [HttpPost("Get")]
        public async Task<IActionResult> GetRequestModel([FromBody] GetLessonsQuery request)
        {
            try
            {
                var result = await _mediator.Send(request);
                return Ok(ApiResponseFactory.Success(result, "LessonsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "LessonsFetchFailed",
                    _messageService,
                    new List<string> { $"An error occurred while fetching lessons: {ex.Message}" }
                ));
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateLessonDto lessonDto)
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

                var command = new CreateLessonCommand(lessonDto, teacherId);
                var lessonOid = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(lessonOid, "LessonCreatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "LessonCreationFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateLessonDto lessonDto)
        {
            try
            {
                if (id != lessonDto.Oid)
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Errors = new List<string> { "ID mismatch between URL and body." }
                    });
                }

                var command = new UpdateLessonCommand(id, lessonDto);
                var response = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(response, "LessonUpdatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "LessonUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var command = new DeleteLessonCommand(id);
                await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(true, "LessonDeletedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "LessonDeletionFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats([FromQuery] GetLessonStatsQuery query)
        {
            try
            {
                var result = await _mediator.Send(query);
                return Ok(ApiResponseFactory.Success(result, "LessonStatsFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "LessonStatsFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching lesson stats." }
                ));
            }
        }
    }
}