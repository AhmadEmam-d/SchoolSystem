using MediatR;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Classes.Commands.Create;
using SchoolSystem.Application.Features.Classes.Commands.Delete;
using SchoolSystem.Application.Features.Classes.Commands.Update;
using SchoolSystem.Application.Features.Classes.DTOs.Create;
using SchoolSystem.Application.Features.Classes.DTOs.Update;
using SchoolSystem.Application.Features.Classes.Queries.GetAll;
using SchoolSystem.Application.Features.Classes.Queries.GetByOid;
using SchoolSystem.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClassesController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;

        public ClassesController(IMediator mediator, IMessageService messageService)
        {
            _mediator = mediator;
            _messageService = messageService;
        }

        // ===========================
        // 🔹 GET ALL CLASSES
        // ===========================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _mediator.Send(new GetAllClassesQuery());
                return Ok(ApiResponseFactory.Success(result, "ClassesFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ClassesFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching classes." }
                ));
            }
        }

        // ===========================
        // 🔹 GET CLASS BY ID
        // ===========================
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var result = await _mediator.Send(new GetClassByIdQuery(id));

                if (result == null)
                {
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "ClassNotFound", _messageService,
                        new List<string> { "Class does not exist." }
                    ));
                }

                return Ok(ApiResponseFactory.Success(result, "ClassFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ClassFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching the class." }
                ));
            }
        }

        // ===========================
        // 🔹 CREATE CLASS
        // ===========================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateClassDto dto)
        {
            try
            {
                var command = new CreateClassCommand(dto);
                var classOid = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(classOid, "ClassCreatedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ClassCreationFailed", _messageService,
                    new List<string> { "An error occurred while creating the class." }
                ));
            }
        }

        // ===========================
        // 🔹 UPDATE CLASS
        // ===========================
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateClassDto dto)
        {
            try
            {
                var command = new UpdateClassCommand(id, dto);

                if (id != command.Oid)
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Errors = new List<string> { "ID mismatch between URL and body." }
                    });
                }

                var response = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(response.Oid, "ClassUpdatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ClassUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // ===========================
        // 🔹 DELETE CLASS
        // ===========================
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, [FromBody] DeleteClassCommand command)
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

                return Ok(ApiResponseFactory.Success(true, "ClassDeletedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ClassDeletionFailed", _messageService,
                    new List<string> { "An error occurred while deleting the class." }
                ));
            }
        }
    }
}