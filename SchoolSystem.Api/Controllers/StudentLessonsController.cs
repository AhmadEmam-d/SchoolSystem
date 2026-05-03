// API/Controllers/StudentLessonsController.cs
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Application.Features.Lessons.Queries.GetStudentLessons;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace SchoolSystem.API.Controllers
{
    [Route("api/student/lessons")]
    [ApiController]
    [Authorize(Roles = "Student")]
    public class StudentLessonsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;
        private readonly IGenericRepository<Student> _studentRepo;

        public StudentLessonsController(
            IMediator mediator,
            IMessageService messageService,
            IGenericRepository<Student> studentRepo)
        {
            _mediator = mediator;
            _messageService = messageService;
            _studentRepo = studentRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyLessons([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
        {
            try
            {
                var student = await GetCurrentStudent();
                if (student == null)
                    return Unauthorized();

                var query = new GetStudentLessonsQuery
                {
                    ClassOid = student.ClassOid,
                    FromDate = fromDate,
                    ToDate = toDate
                };

                var result = await _mediator.Send(query);

                return Ok(ApiResponseFactory.Success(result, "LessonsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "LessonsFetchFailed", _messageService,
                    new System.Collections.Generic.List<string> { ex.Message }
                ));
            }
        }

        [HttpGet("today")]
        public async Task<IActionResult> GetTodayLessons()
        {
            try
            {
                var student = await GetCurrentStudent();
                if (student == null)
                    return Unauthorized();

                var query = new GetStudentLessonsQuery
                {
                    ClassOid = student.ClassOid,
                    FromDate = DateTime.UtcNow.Date,
                    ToDate = DateTime.UtcNow.Date.AddDays(1).AddTicks(-1)
                };

                var result = await _mediator.Send(query);

                return Ok(ApiResponseFactory.Success(result, "TodayLessonsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "LessonsFetchFailed", _messageService,
                    new System.Collections.Generic.List<string> { ex.Message }
                ));
            }
        }

        [HttpGet("upcoming")]
        public async Task<IActionResult> GetUpcomingLessons()
        {
            try
            {
                var student = await GetCurrentStudent();
                if (student == null)
                    return Unauthorized();

                var query = new GetStudentLessonsQuery
                {
                    ClassOid = student.ClassOid,
                    FromDate = DateTime.UtcNow.Date,
                    ToDate = DateTime.UtcNow.Date.AddDays(7)
                };

                var result = await _mediator.Send(query);

                return Ok(ApiResponseFactory.Success(result, "UpcomingLessonsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "LessonsFetchFailed", _messageService,
                    new System.Collections.Generic.List<string> { ex.Message }
                ));
            }
        }

        [HttpGet("subject/{subjectId:guid}")]
        public async Task<IActionResult> GetLessonsBySubject(Guid subjectId)
        {
            try
            {
                var student = await GetCurrentStudent();
                if (student == null)
                    return Unauthorized();

                var query = new GetStudentLessonsQuery
                {
                    ClassOid = student.ClassOid,
                    SubjectOid = subjectId
                };

                var result = await _mediator.Send(query);

                return Ok(ApiResponseFactory.Success(result, "SubjectLessonsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "LessonsFetchFailed", _messageService,
                    new System.Collections.Generic.List<string> { ex.Message }
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