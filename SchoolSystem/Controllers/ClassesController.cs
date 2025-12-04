using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Application.Features.Classes.Commands.Create;
using SchoolSystem.Application.Features.Classes.Commands.Delete;
using SchoolSystem.Application.Features.Classes.Commands.Update;
using SchoolSystem.Application.Features.Classes.DTOs.Create;
using SchoolSystem.Application.Features.Classes.DTOs.Update;
using SchoolSystem.Application.Features.Classes.Queries.GetAll;
using SchoolSystem.Application.Features.Classes.Queries.GetByOid;

namespace SchoolSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ClassesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateClassDto dto)
        {
            var id = await _mediator.Send(new CreateClassCommand(dto));
            return Ok(new { Id = id });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            return Ok(await _mediator.Send(new GetClassByIdQuery(id)));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _mediator.Send(new GetAllClassesQuery()));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateClassDto dto)
        {
            await _mediator.Send(new UpdateClassCommand(id, dto));
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _mediator.Send(new DeleteClassCommand(id));
            return NoContent();
        }
    }

}
