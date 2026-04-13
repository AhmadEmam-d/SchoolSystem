using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Application.Features.Homeworks.Commands.Create;
using SchoolSystem.Application.Features.Homeworks.Queries.Get;
using SchoolSystem.Application.Features.Homeworks.DTOs.Create;
using System.Security.Claims;

namespace SchoolSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // كل الـ endpoints محتاجة Login
    public class HomeworkController : ControllerBase
    {
        private readonly IMediator _mediator;

        public HomeworkController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("teacher/{teacherId}")]
        [Authorize(Policy = "TeacherOnly")] // ✅
        public async Task<IActionResult> GetTeacherHomeworks(Guid teacherId)
        {
            var query = new GetTeacherHomeworksQuery(teacherId);
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost("add")]
        [Authorize(Policy = "TeacherOnly")] // ✅
        public async Task<IActionResult> CreateHomework([FromBody] CreateHomeworksDto dto)
        {
            // جيب الـ TeacherId من الـ JWT Token
            var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (teacherIdClaim == null || !Guid.TryParse(teacherIdClaim, out Guid teacherId))
                return Unauthorized("Teacher ID not found in token");

            var command = new CreateHomeworkCommand(dto, teacherId);
            var result = await _mediator.Send(command);

            return result ? Ok(new { message = "Homework Created" }) : BadRequest();
        }
    }
}