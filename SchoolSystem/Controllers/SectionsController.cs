using MediatR;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Application.Features.Parents.Queries.GetById;
using SchoolSystem.Application.Features.Sections.Commands.Create;
using SchoolSystem.Application.Features.Sections.Commands.Delete;
using SchoolSystem.Application.Features.Sections.Commands.Update;
using SchoolSystem.Application.Features.Sections.DTOs.Create;
using SchoolSystem.Application.Features.Sections.DTOs.Read;
using SchoolSystem.Application.Features.Sections.DTOs.Update;
using SchoolSystem.Application.Features.Sections.Queries.GetAll;
using SchoolSystem.Application.Features.Sections.Queries.GetById;
using SchoolSystem.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class SectionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SectionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateSectionDto dto)
    {
        var id = await _mediator.Send(new CreateSectionCommand(dto));
        return Ok(id);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SectionDto>> GetByOid(Guid id)
    {
        var section = await _mediator.Send(new GetSectionByIdQuery(id));
        return Ok(section);
    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SectionDto>>> GetAll()
    {
        var sections = await _mediator.Send(new GetAllSectionsQuery());
        return Ok(sections);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateSectionDto dto)
    {
        await _mediator.Send(new UpdateSectionCommand(id, dto));
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _mediator.Send(new DeleteSectionCommand(id));
        return NoContent();
    }
}
