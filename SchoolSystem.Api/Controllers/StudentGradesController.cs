using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Application.Features.StudentGrades.Queries.GetStudentGrades;
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
    [Route("api/student/grades")]
    [ApiController]
    [Authorize(Roles = "Student")]
    public class StudentGradesController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;
        private readonly IGenericRepository<Student> _studentRepo;

        public StudentGradesController(
            IMediator mediator,
            IMessageService messageService,
            IGenericRepository<Student> studentRepo)
        {
            _mediator = mediator;
            _messageService = messageService;
            _studentRepo = studentRepo;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetGradesDashboard()
        {
            try
            {
                var userIdClaim = User.FindFirst("UserId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                {
                    return Unauthorized(ApiResponseFactory.Failure<object>(
                        "Unauthorized", _messageService,
                        new List<string> { "User ID not found." }
                    ));
                }

                var student = await _studentRepo.GetAllQueryable()
                    .FirstOrDefaultAsync(s => s.UserId == userId);

                if (student == null)
                {
                    return NotFound(ApiResponseFactory.Failure<object>(
                        "StudentNotFound", _messageService,
                        new List<string> { "Student not found." }
                    ));
                }

                var query = new GetStudentGradesQuery(student.Oid);
                var result = await _mediator.Send(query);

                return Ok(ApiResponseFactory.Success(result, "GradesFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "GradesFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
    }
}