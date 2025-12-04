using MediatR;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Application.Features.Subjects.DTOs.Create;
using SchoolSystem.Application.Features.Subjects.DTOs.Update.SchoolSystem.Application.Features.Subjects.DTOs.Update;

namespace SchoolSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public SubjectsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // 🔹 Create Subject
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSubjectDto dto)
        {
            var command = new CreateSubjectCommand(dto);
            var oid = await _mediator.Send(command);
            return Ok(new { Message = "Subject created", Oid = oid });
        }

        // 🔹 Get All Subjects
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var subjects = await _mediator.Send(new GetAllSubjectsQuery());
            return Ok(subjects);
        }

        // 🔹 Get Subject By Id
        [HttpGet("{oid}")]
        public async Task<IActionResult> GetById(Guid oid)
        {
            var subject = await _mediator.Send(new GetSubjectByIdQuery(oid));
            if (subject == null) return NotFound(new { Message = "Subject not found" });
            return Ok(subject);
        }

        // 🔹 Update Subject
        [HttpPut("{oid}")]
        public async Task<IActionResult> Update(Guid oid, [FromBody] UpdateSubjectDto dto)
        {
            var command = new UpdateSubjectCommand(oid, dto);
            await _mediator.Send(command);
            return Ok(new { Message = "Subject updated" });
        }

        // 🔹 Delete Subject
        [HttpDelete("{oid}")]
        public async Task<IActionResult> Delete(Guid oid)
        {
            var command = new DeleteSubjectCommand(oid);
            await _mediator.Send(command);
            return Ok(new { Message = "Subject deleted" });
        }
    }
}
