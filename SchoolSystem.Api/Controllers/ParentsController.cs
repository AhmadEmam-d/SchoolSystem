using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Parents.Commands.Create;
using SchoolSystem.Application.Features.Parents.Commands.Delete;
using SchoolSystem.Application.Features.Parents.Commands.Update;
using SchoolSystem.Application.Features.Parents.DTOs.Create;
using SchoolSystem.Application.Features.Parents.DTOs.Read;
using SchoolSystem.Application.Features.Parents.DTOs.Update;
using SchoolSystem.Application.Features.Parents.Queries.Get;
using SchoolSystem.Application.Features.Parents.Queries.GetAll;
using SchoolSystem.Application.Features.Parents.Queries.GetById;
using SchoolSystem.Application.Features.Parents.Queries.GetMyChildren;
using SchoolSystem.Application.Features.Parents.Queries.GetParentAttendance;
using SchoolSystem.Application.Features.Parents.Queries.GetParentDashboard;
using SchoolSystem.Application.Features.Parents.Queries.GetParentGrades;
using SchoolSystem.Application.Features.Parents.Queries.GetStudentHomework;
using SchoolSystem.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SchoolSystem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    
    public class ParentsController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;

        public ParentsController(IMediator mediator, IMessageService messageService)
        {
            _mediator = mediator;
            _messageService = messageService;
        }


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _mediator.Send(new GetAllParentsQuery());
                return Ok(ApiResponseFactory.Success(result, "ParentsFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ParentsFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching parents." }
                ));
            }
        }


        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var result = await _mediator.Send(new GetParentByIdQuery(id));

                if (result == null)
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "ParentNotFound", _messageService,
                        new List<string> { "Parent does not exist." }
                    ));

                return Ok(ApiResponseFactory.Success(result, "ParentFetchedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ParentFetchFailed", _messageService,
                    new List<string> { "An error occurred while fetching the parent." }
                ));
            }
        }
        [HttpPost("Get")]
        public async Task<IActionResult> GetRequestModel([FromBody] GetParentsQuery request)
        {
            try
            {
                var result = await _mediator.Send(request);

                return Ok(ApiResponseFactory.SuccessPaged(
                    result,
                    "ParentsFetchedSuccessfully",
                    _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ParentsFetchFailed",
                    _messageService,
                    new List<string> { $"An error occurred while fetching parents: {ex.Message}" }
                ));
            }
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateParentDto dto)
        {
            try
            {
                var command = new CreateParentCommand(dto);
                var parentOid = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(parentOid, "ParentCreatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ParentCreationFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }


        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateParentDto dto)
        {
            try
            {
                var command = new UpdateParentCommand(id, dto);

                if (id != command.Oid)
                {
                    return BadRequest(new ApiResponse<bool>
                    {
                        Success = false,
                        Errors = new List<string> { "ID mismatch between URL and body." }
                    });
                }

                var response = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(response.Oid, "ParentUpdatedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ParentUpdateFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }


        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id, [FromBody] DeleteParentCommand command)
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

                return Ok(ApiResponseFactory.Success(true, "ParentDeletedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ParentDeletionFailed", _messageService,
                    new List<string> { "An error occurred while deleting the parent." }
                ));
            }
        }
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                {
                    return Unauthorized();
                }

                var query = new GetParentDashboardQuery { ParentUserId = userId };
                var dashboard = await _mediator.Send(query);

                return Ok(ApiResponseFactory.Success(dashboard, "ParentDashboardFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
            "ParentDashboardFetchFailed", _messageService,
            new List<string> { ex.Message }));
            }
        }
        [HttpGet("my-children")]
        public async Task<IActionResult> GetMyChildren()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                {
                    return Unauthorized();
                }

                var query = new GetMyChildrenQuery { ParentUserId = userId };
                var result = await _mediator.Send(query);

                return Ok(ApiResponseFactory.Success(result, "ChildrenFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
            "ChildrenFetchFailed", _messageService,
            new List<string> { ex.Message }));
            }
        }
        [HttpGet("Children-Attendance")]
        [Authorize(Roles = "Parent")]
        public async Task<IActionResult> GetParentDashboard()
        {
            try
            {
                var parentIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (parentIdClaim == null || !Guid.TryParse(parentIdClaim.Value, out var parentId))
                    return Unauthorized();

                var query = new GetParentAttendanceQuery(parentId);
                var result = await _mediator.Send(query);

                return Ok(ApiResponseFactory.Success(result, "ParentDashboardFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ParentDashboardFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
        [HttpGet("children-homework")]
        [Authorize(Roles = "Parent")]
        public async Task<IActionResult> GetChildrenHomework()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                    return Unauthorized();
                

                var query = new GetStudentHomeworkQuery { ParentUserId = userId };
                var result = await _mediator.Send(query);

                return Ok(ApiResponseFactory.Success(result, "ChildrenHomeworkFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "ChildrenHomeworkFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
        [HttpGet("grades")]
        [Authorize(Roles = "Parent")]
        public async Task<IActionResult> GetParentGrades()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                    return Unauthorized();

                var result = await _mediator.Send(
                    new GetParentGradesQuery { ParentUserId = userId });

                return Ok(ApiResponseFactory.Success(result,
                    "GradesFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "GradesFetchFailed", _messageService,
                    new List<string> { ex.Message }));
            }
        }
    }
}