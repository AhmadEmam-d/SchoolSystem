using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Application.Features.Timetable.Queries.GetStudentWeeklySchedule;
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
    [Route("api/student/timetable")]
    [ApiController]
    [Authorize(Roles = "Student")]
    public class StudentTimetableController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;
        private readonly IGenericRepository<Student> _studentRepo;

        public StudentTimetableController(
            IMediator mediator,
            IMessageService messageService,
            IGenericRepository<Student> studentRepo)
        {
            _mediator = mediator;
            _messageService = messageService;
            _studentRepo = studentRepo;
        }

        [HttpGet("weekly")]
        public async Task<IActionResult> GetWeeklySchedule([FromQuery] DateTime? weekStartDate)
        {
            try
            {
                // Try to get UserId from different claim types
                var userIdClaim = User.FindFirst("UserId") ??
                                 User.FindFirst(ClaimTypes.NameIdentifier);

                if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                {
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "Unauthorized", _messageService,
                        new List<string> { "User ID not found in token." }
                    ));
                }

                // Find student by UserId
                var student = await _studentRepo.GetAllQueryable()
                    .FirstOrDefaultAsync(s => s.UserId == userId);

                if (student == null)
                {
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "StudentNotFound", _messageService,
                        new List<string> { $"Student not found with UserId: {userId}" }
                    ));
                }

                var query = new GetStudentWeeklyScheduleQuery(student.Oid, weekStartDate);
                var result = await _mediator.Send(query);

                return Ok(ApiResponseFactory.Success(result, "WeeklyScheduleFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "WeeklyScheduleFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
    }
}