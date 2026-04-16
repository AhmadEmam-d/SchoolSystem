using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Application.Features.StudentHomeworks.Commands.SubmitHomework;
using SchoolSystem.Application.Features.StudentHomeworks.DTOs;
using SchoolSystem.Application.Features.StudentHomeworks.Queries.GetHomeworkDetails;
using SchoolSystem.Application.Features.StudentHomeworks.Queries.GetStudentHomeworks;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SchoolSystem.API.Controllers
{
    [Route("api/student/homework")]
    [ApiController]
    [Authorize(Roles = "Student")]
    public class StudentHomeworkController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;
        private readonly IGenericRepository<Student> _studentRepo;

        public StudentHomeworkController(
            IMediator mediator,
            IMessageService messageService,
            IGenericRepository<Student> studentRepo)
        {
            _mediator = mediator;
            _messageService = messageService;
            _studentRepo = studentRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetHomeworks([FromQuery] string? status)
        {
            try
            {
                var student = await GetCurrentStudent();
                if (student == null)
                    return Unauthorized();

                var query = new GetStudentHomeworksQuery { StudentId = student.Oid, Status = status };
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

        [HttpGet("{homeworkId:guid}")]
        public async Task<IActionResult> GetHomeworkDetails(Guid homeworkId)
        {
            try
            {
                var student = await GetCurrentStudent();
                if (student == null)
                    return Unauthorized();

                var query = new GetHomeworkDetailsQuery { HomeworkId = homeworkId, StudentId = student.Oid };
                var result = await _mediator.Send(query);

                return Ok(ApiResponseFactory.Success(result, "HomeworkDetailsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "HomeworkDetailsFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpPost("{homeworkId:guid}/submit")]
        public async Task<IActionResult> SubmitHomework(Guid homeworkId, [FromBody] SubmitHomeworkDto dto)
        {
            try
            {
                var student = await GetCurrentStudent();
                if (student == null)
                    return Unauthorized();

                var command = new SubmitHomeworkCommand
                {
                    HomeworkId = homeworkId,
                    StudentId = student.Oid,
                    SubmissionText = dto.SubmissionText,
                    AttachmentUrl = dto.AttachmentUrl
                };

                var result = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(result, "HomeworkSubmittedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "HomeworkSubmissionFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        private async Task<Student> GetCurrentStudent()
        {
            var userIdClaim = User.FindFirst("UserId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                return null;

            return await _studentRepo.GetAllQueryable()
                .FirstOrDefaultAsync(s => s.UserId == userId);
        }
    }
}