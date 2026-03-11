using MediatR;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Students.Commands.Create;
using SchoolSystem.Application.Features.Students.Commands.Update;
using SchoolSystem.Application.Features.Students.DTOs.Create;
using SchoolSystem.Application.Features.Students.DTOs.Update;
using SchoolSystem.Application.Interfaces.Services;
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
        private readonly IMessageService _messageService;

        public StudentsController(IMediator mediator, IMessageService messageService)
        {
            _mediator = mediator;
            _messageService = messageService;
        }

        // ===========================
        // 🔹 GET ALL STUDENTS
        // ===========================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _mediator.Send(new GetAllStudentsQuery());
                return Ok(ApiResponseFactory.Success(result, "StudentsFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "StudentsFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching students." }
                ));
            }
        }

        // ===========================
        // 🔹 GET STUDENT BY ID
        // ===========================
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var result = await _mediator.Send(new GetStudentByIdQuery(id));

               

                return Ok(ApiResponseFactory.Success(result, "StudentFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "StudentFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching the student." }
                ));
            }
        }

        // ===========================
        // 🔹 CREATE STUDENT
        // ===========================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateStudentDto studentDto)
        {
            try
            {
                var command = new CreateStudentCommand(studentDto);
                var studentOid = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(studentOid, "StudentCreatedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "StudentCreationFailed", _messageService,
                    new List<string> { "An error occurred while creating the student." }
                ));
            }
        }

        // ===========================
        // 🔹 UPDATE STUDENT
        // ===========================
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateStudentDto studentDto)
        {
            try
            {
                var command = new UpdateStudentCommand(id, studentDto);

                if (id != command.Oid)
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Errors = new List<string> { "ID mismatch between URL and body." }
                    });
                }

                var response = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(response.Oid, "StudentUpdatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "StudentUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // ===========================
        // 🔹 DELETE STUDENT
        // ===========================
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, [FromBody] DeleteStudentCommand command)
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

                return Ok(ApiResponseFactory.Success(true, "StudentDeletedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "StudentDeletionFailed", _messageService,
                    new List<string> { "An error occurred while deleting the student." }
                ));
            }
        }
    }
}