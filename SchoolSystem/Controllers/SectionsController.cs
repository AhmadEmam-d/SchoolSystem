using MediatR;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Sections.Commands.Create;
using SchoolSystem.Application.Features.Sections.Commands.Delete;
using SchoolSystem.Application.Features.Sections.Commands.Update;
using SchoolSystem.Application.Features.Sections.DTOs.Create;
using SchoolSystem.Application.Features.Sections.DTOs.Read;
using SchoolSystem.Application.Features.Sections.DTOs.Update;
using SchoolSystem.Application.Features.Sections.Queries.Get;
using SchoolSystem.Application.Features.Sections.Queries.GetAll;
using SchoolSystem.Application.Features.Sections.Queries.GetById;
using SchoolSystem.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SectionsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;

        public SectionsController(IMediator mediator, IMessageService messageService)
        {
            _mediator = mediator;
            _messageService = messageService;
        }


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _mediator.Send(new GetAllSectionsQuery());
                return Ok(ApiResponseFactory.Success(result, "SectionsFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SectionsFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching sections." }
                ));
            }
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var result = await _mediator.Send(new GetSectionByIdQuery(id));

                if (result == null)
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "SectionNotFound", _messageService,
                        new List<string> { "Section does not exist." }
                    ));

                return Ok(ApiResponseFactory.Success(result, "SectionFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SectionFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching the section." }
                ));
            }
        }
        [HttpPost("Get")]
        public async Task<IActionResult> GetRequestModel([FromBody] GetSectionsQuery request)
        {
            try
            {
                var result = await _mediator.Send(request);

                return Ok(ApiResponseFactory.SuccessPaged(
                    result,
                    "SectionsFetchedSuccessfully",
                    _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SectionsFetchFailed",
                    _messageService,
                    new List<string> { $"An error occurred while fetching sections: {ex.Message}" }
                ));
            }
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSectionDto dto)
        {
            try
            {
                var command = new CreateSectionCommand(dto);
                var sectionOid = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(sectionOid, "SectionCreatedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SectionCreationFailed", _messageService,
                    new List<string> { "An error occurred while creating the section." }
                ));
            }
        }


        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateSectionDto dto)
        {
            try
            {
                var command = new UpdateSectionCommand(id, dto);

                if (id != command.Oid)
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Errors = new List<string> { "ID mismatch between URL and body." }
                    });
                }

                var response = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(response.Oid, "SectionUpdatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SectionUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, [FromBody] DeleteSectionCommand command)
        {
            try
            {
                if (id != command.Id)
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Errors = new List<string> { "ID mismatch between URL and body." }
                    });
                }

                await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(true, "SectionDeletedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SectionDeletionFailed", _messageService,
                    new List<string> { "An error occurred while deleting the section." }
                ));
            }
        }
    }
}