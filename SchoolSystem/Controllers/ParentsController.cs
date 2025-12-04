using MediatR;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Application.Features.Parents.Commands.Create;
using SchoolSystem.Application.Features.Parents.Commands.Delete;
using SchoolSystem.Application.Features.Parents.Commands.Update;
using SchoolSystem.Application.Features.Parents.DTOs.Create;
using SchoolSystem.Application.Features.Parents.DTOs.Read;
using SchoolSystem.Application.Features.Parents.DTOs.Update;
using SchoolSystem.Application.Features.Parents.Queries.GetAll;
using SchoolSystem.Application.Features.Parents.Queries.GetById;

[ApiController]
[Route("api/[controller]")]
public class ParentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ParentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateParentDto dto)
    {
        var id = await _mediator.Send(new CreateParentCommand(dto));
        return Ok(id);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ParentDto>> GetById(Guid id)
    {
        var parent = await _mediator.Send(new GetParentByIdQuery(id));
        return Ok(parent);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ParentDto>>> GetAll()
    {
        var parents = await _mediator.Send(new GetAllParentsQuery());
        return Ok(parents);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateParentDto dto)
    {
        await _mediator.Send(new UpdateParentCommand(id, dto));
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _mediator.Send(new DeleteParentCommand(id));
        return NoContent();
    }
}
