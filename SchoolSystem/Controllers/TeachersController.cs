using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Teachers.Command.Create;
using SchoolSystem.Application.Features.Teachers.Command.Delete;
using SchoolSystem.Application.Features.Teachers.Command.Update;
using SchoolSystem.Application.Features.Teachers.DTOs.Update;
using SchoolSystem.Application.Features.Teachers.Query.GetAll;
using SchoolSystem.Application.Features.Teachers.Query.GetById;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Application.Interfaces.Services;

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

        // ===========================
        // 🔹 GET ALL TEACHERS
        // ===========================
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
                    "TeachersFetchFailed",_messageService,
                    new List<string> { "An error occurred while fetching teachers." }
                ));
            }
        }

        // ===========================
        // 🔹 GET TEACHER BY OID
        // ===========================
        [HttpGet("{oid}")]
        public async Task<IActionResult> GetByOid(Guid oid)
        {
            try
            {
                var result = await _mediator.Send(new GetTeacherByIdQuery(oid));

                if (result?.Teacher == null)
                {
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "TeacherNotFound",
                        _messageService,
                        new List<string> { "Teacher does not exist." }
                    ));
                }

                return Ok(ApiResponseFactory.Success(
                    result.Teacher,
                    "TeacherFetchedSuccessfully",
                    _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "TeacherFetchFailed",
                    _messageService,
                    new List<string> { "An error occurred while fetching the teacher." }
                ));
            }
        }


        // ===========================
        // 🔹 CREATE TEACHER
        // ===========================
        [HttpPost]
        public async Task<IActionResult> Create(CreateTeacherCommand command)
        {
            try
            {
                Guid teacherOid = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(
                    teacherOid,
                    "TeacherCreatedSuccessfully",
                    _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "TeacherCreationFailed",
                    _messageService,
                    new List<string> { "An error occurred while creating the teacher." }
                ));
            }
        }


        // ===========================
        // 🔹 UPDATE TEACHER
        // ===========================
        [HttpPut("{oid}")]
        public async Task<IActionResult> Update(Guid oid, UpdateTeacherCommand command)
        {
            try
            {
                if (oid != command.Teacher.Oid)
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Errors = new List<string> { "ID mismatch between URL and body." }
                    });
                }

                await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(
                    true,
                    "TeacherUpdatedSuccessfully",
                    _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "TeacherUpdateFailed",
                    _messageService,
                    new List<string> { "An error occurred while updating the teacher." }
                ));
            }
        }

        // ===========================
        // 🔹 DELETE TEACHER
        // ===========================
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

                await _mediator.Send(command); // Unit returned

                return Ok(ApiResponseFactory.Success(
                    true,
                    "TeacherDeletedSuccessfully",
                    _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "TeacherDeletionFailed",
                    _messageService,
                    new List<string> { "An error occurred while deleting the teacher." }
                ));
            }
        }

    }
}
