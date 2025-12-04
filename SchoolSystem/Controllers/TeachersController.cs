using MediatR;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Application.Features.Teachers.Command.Create;
using SchoolSystem.Application.Features.Teachers.Command.Delete;
using SchoolSystem.Application.Features.Teachers.Command.Update;
using SchoolSystem.Application.Features.Teachers.DTOs.Create;
using SchoolSystem.Application.Features.Teachers.DTOs.Create.SchoolSystem.Application.Features.Teachers.DTOs.Create;
using SchoolSystem.Application.Features.Teachers.DTOs.Update;
using SchoolSystem.Application.Features.Teachers.DTOs.Update.SchoolSystem.Application.Features.Teachers.DTOs.Update;
using SchoolSystem.Application.Features.Teachers.Query.GetAll;
using SchoolSystem.Application.Features.Teachers.Query.GetById;

namespace SchoolSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeachersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TeachersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // ===========================
        // 🔹 CREATE TEACHER
        // POST: api/teachers
        // ===========================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTeacherDto dto)
        {
            var command = new CreateTeacherCommand(dto);
            var teacherOid = await _mediator.Send(command);

            return Ok(new { Message = "Teacher created successfully", Oid = teacherOid });
        }

        // ===========================
        // 🔹 GET ALL TEACHERS
        // GET: api/teachers
        // ===========================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var teachers = await _mediator.Send(new GetAllTeachersQuery());
            return Ok(teachers);
        }

        // ===========================
        // 🔹 GET TEACHER BY ID
        // GET: api/teachers/{oid}
        // ===========================
        [HttpGet("{oid}")]
        public async Task<IActionResult> GetById(Guid oid)
        {
            var teacher = await _mediator.Send(new GetTeacherByIdQuery(oid));

            if (teacher == null)
                return NotFound(new { Message = "Teacher not found" });

            return Ok(teacher);
        }

        // ===========================
        // 🔹 UPDATE TEACHER
        // PUT: api/teachers/{oid}
        // ===========================
        [HttpPut("{oid}")]
        public async Task<IActionResult> Update(Guid oid, [FromBody] UpdateTeacherDto dto)
        {
            var command = new UpdateTeacherCommand(oid, dto);
            await _mediator.Send(command);

            return Ok(new { Message = "Teacher updated successfully" });
        }

        // ===========================
        // 🔹 DELETE TEACHER
        // DELETE: api/teachers/{oid}
        // ===========================
        [HttpDelete("{oid}")]
        public async Task<IActionResult> Delete(Guid oid)
        {
            var command = new DeleteTeacherCommand(oid);
            await _mediator.Send(command);

            return Ok(new { Message = "Teacher deleted successfully" });
        }
    }
}
