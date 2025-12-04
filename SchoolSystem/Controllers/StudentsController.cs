using MediatR;
using Microsoft.AspNetCore.Mvc;

using SchoolSystem.Application.Features.Students.DTOs.Create;
using SchoolSystem.Application.Features.Students.DTOs.Read;
using SchoolSystem.Application.Features.Students.DTOs.Update;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public StudentsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: api/students
        [HttpGet]
        public async Task<ActionResult<List<StudentDto>>> GetAll()
        {
            var query = new GetAllStudentsQuery();
            var students = await _mediator.Send(query);
            return Ok(students);
        }

        // GET: api/students/{id}
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<StudentDto>> GetById(Guid id)
        {
            var query = new GetStudentByIdQuery(id);
            var student = await _mediator.Send(query);

            if (student == null)
                return NotFound();

            return Ok(student);
        }

        // POST: api/students
        [HttpPost]
        public async Task<ActionResult<Guid>> Create([FromBody] CreateStudentDto studentDto)
        {
            var command = new CreateStudentCommand(studentDto);
            var studentId = await _mediator.Send(command);

            return CreatedAtAction(nameof(GetById), new { id = studentId }, studentId);
        }

        // PUT: api/students/{id}
        [HttpPut("{id:guid}")]
        public async Task<ActionResult> Update(Guid id, [FromBody] UpdateStudentDto studentDto)
        {
            var command = new UpdateStudentCommand(id, studentDto);
            await _mediator.Send(command);

            return NoContent();
        }

        // DELETE: api/students/{id}
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var command = new DeleteStudentCommand(id);
            await _mediator.Send(command);

            return NoContent();
        }
    }
}
