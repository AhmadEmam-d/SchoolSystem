using MediatR;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Teachers.Command.Delete;
using SchoolSystem.Application.Features.Teachers.Commands.Create;
using SchoolSystem.Application.Features.Teachers.Commands.Update;
using SchoolSystem.Application.Features.Teachers.queries.Get;
using SchoolSystem.Application.Features.Teachers.Query.GetAll;
using SchoolSystem.Application.Features.Teachers.Query.GetById;
using SchoolSystem.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeachersController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;

        public TeachersController(IMediator mediator, IMessageService messageService)
        {
            _mediator = mediator;
            _messageService = messageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _mediator.Send(new GetAllTeachersQuery());
                return Ok(ApiResponseFactory.Success(result, "TeachersFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "TeachersFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching teachers." }
                ));
            }
        }

        [HttpGet("{oid}")]
        public async Task<IActionResult> GetByOid(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new GetTeacherByIdQuery(oid));
                return Ok(ApiResponseFactory.Success(result, "TeacherFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "TeacherFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching the teacher." }
                ));
            }
        }

        [HttpPost("Get")]
        public async Task<IActionResult> GetRequestModel([FromBody] GetTeachersQuery request)
        {
            try
            {
                var result = await _mediator.Send(request);

                return Ok(ApiResponseFactory.SuccessPaged(
                    result,
                    "TeachersFetchedSuccessfully",
                    _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "TeachersFetchFailed",
                    _messageService,
                    new List<string> { "An error occurred while fetching teachers." }
                ));
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateTeacherCommand command)
        {
            try
            {
                var teacherOid = await _mediator.Send(command);
                return Ok(ApiResponseFactory.Success(teacherOid, "TeacherCreatedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "TeacherCreationFailed", _messageService,
                    new List<string> { "An error occurred while creating the teacher." }
                ));
            }
        }

        [HttpPut("{oid}")]
        public async Task<IActionResult> Update(Guid oid, UpdateTeacherCommand command)
        {
            try
            {
                if (oid != command.Oid)
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Errors = new List<string> { "ID mismatch between URL and body." }
                    });
                }

                var response = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(
                    response.Oid,
                    "TeacherUpdatedSuccessfully",
                    _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "TeacherUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpDelete("{oid}")]
        public async Task<IActionResult> Delete(Guid oid, DeleteTeacherCommand command)
        {
            try
            {
                if (oid != command.Oid)
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Errors = new List<string> { "ID mismatch between URL and body." }
                    });
                }

                await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(true, "TeacherDeletedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "TeacherDeletionFailed", _messageService,
                    new List<string> { "An error occurred while deleting the teacher." }
                ));
            }
        }
    }
}