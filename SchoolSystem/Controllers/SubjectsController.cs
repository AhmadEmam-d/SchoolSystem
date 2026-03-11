using MediatR;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Subjects.Commands.Create;
using SchoolSystem.Application.Features.Subjects.Commands.Update;
using SchoolSystem.Application.Features.Subjects.DTOs.Create;
using SchoolSystem.Application.Features.Subjects.DTOs.Update;
using SchoolSystem.Application.Features.Subjects.DTOs.Update.SchoolSystem.Application.Features.Subjects.DTOs.Update;
using SchoolSystem.Application.Features.Subjects.Queries.Get;
using SchoolSystem.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;

        public SubjectsController(IMediator mediator, IMessageService messageService)
        {
            _mediator = mediator;
            _messageService = messageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _mediator.Send(new GetAllSubjectsQuery());
                return Ok(ApiResponseFactory.Success(result, "SubjectsFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SubjectsFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching subjects." }
                ));
            }
        }


        [HttpGet("{oid:guid}")]
        public async Task<IActionResult> GetById(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new GetSubjectByIdQuery(oid));

                if (result == null)
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "SubjectNotFound", _messageService,
                        new List<string> { "Subject does not exist." }
                    ));

                return Ok(ApiResponseFactory.Success(result, "SubjectFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SubjectFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching the subject." }
                ));
            }
        }
        [HttpPost("Get")]
        public async Task<IActionResult> GetRequestModel([FromBody] GetSubjectsQuery request)
        {
            try
            {
                var result = await _mediator.Send(request);

                return Ok(ApiResponseFactory.SuccessPaged(
                    result,
                    "SubjectsFetchedSuccessfully",
                    _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SubjectsFetchFailed",
                    _messageService,
                    new List<string> { $"An error occurred while fetching subjects: {ex.Message}" }
                ));
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSubjectDto dto)
        {
            try
            {
                var command = new CreateSubjectCommand(dto);
                var subjectOid = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(subjectOid, "SubjectCreatedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SubjectCreationFailed", _messageService,
                    new List<string> { "An error occurred while creating the subject." }
                ));
            }
        }


        [HttpPut("{oid:guid}")]
        public async Task<IActionResult> Update(Guid oid, [FromBody] UpdateSubjectDto dto)
        {
            try
            {
                var command = new UpdateSubjectCommand(oid, dto);

                if (oid != command.Oid)
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Errors = new List<string> { "ID mismatch between URL and body." }
                    });
                }

                var response = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(response.Oid, "SubjectUpdatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SubjectUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }


        [HttpDelete("{oid:guid}")]
        public async Task<IActionResult> Delete(Guid oid, [FromBody] DeleteSubjectCommand command)
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

                return Ok(ApiResponseFactory.Success(true, "SubjectDeletedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SubjectDeletionFailed", _messageService,
                    new List<string> { "An error occurred while deleting the subject." }
                ));
            }
        }
    }
}