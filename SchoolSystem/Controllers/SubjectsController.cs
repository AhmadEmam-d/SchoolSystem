using MediatR;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Application.Features.Subjects.DTOs.Create;
using SchoolSystem.Application.Features.Subjects.DTOs.Update.SchoolSystem.Application.Features.Subjects.DTOs.Update;
using SchoolSystem.Application.Interfaces.Services; // IMessageService
using SchoolSystem.Api.Common.Helpers; // ApiResponseFactory

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

        // 🔹 Create Subject
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSubjectDto dto)
        {
            try
            {
                var command = new CreateSubjectCommand(dto);
                var oid = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(oid ,"SubjectCreatedSuccessfully", _messageService));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SubjectCreationFailed", _messageService, new List<string> {"FailedToCreateSubject"}));
            }
        }

        // 🔹 Get All Subjects
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var subjects = await _mediator.Send(new GetAllSubjectsQuery());
                return Ok(ApiResponseFactory.Success(
                    subjects,"SubjectsFetchedSuccessfully", _messageService
                ));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SubjectsFetchFailed",
                    _messageService,
                    new List<string> {"FailedToFetchSubjects" }
                ));
            }
        }

        // 🔹 Get Subject By Id
        [HttpGet("{oid}")]
        public async Task<IActionResult> GetById(Guid oid)
        {
            try
            {
                var subject = await _mediator.Send(new GetSubjectByIdQuery(oid));
                if (subject == null)
                    return NotFound(ApiResponseFactory.Failure<object>(
                        "SubjectNotFound",
                        _messageService,
                        new List<string> {"SubjectNotFound" }
                    ));

                return Ok(ApiResponseFactory.Success(subject, "SubjectFetchedSuccessfully", _messageService
                ));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SubjectFetchFailed",
                    _messageService,
                    new List<string> { "FailedToFetchSubject" }
                ));
            }
        }

        // 🔹 Update Subject
        [HttpPut("{oid}")]
        public async Task<IActionResult> Update(Guid oid, [FromBody] UpdateSubjectDto dto)
        {
            try
            {
                var command = new UpdateSubjectCommand(oid, dto);
                await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(
                    true,
                   "SubjectUpdatedSuccessfully",
                    _messageService
                ));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SubjectUpdateFailed",
                    _messageService,
                    new List<string> { "FailedToUpdateSubject" }
                ));
            }
        }

        // 🔹 Delete Subject
        [HttpDelete("{oid}")]
        public async Task<IActionResult> Delete(Guid oid)
        {
            try
            {
                var command = new DeleteSubjectCommand(oid);
                await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(
                    true,
                   "SubjectDeletedSuccessfully",
                    _messageService
                ));
            }
            catch
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "SubjectDeletionFailed",
                    _messageService,
                    new List<string> { "FailedToDeleteSubject" }
                ));
            }
        }
    }
}
