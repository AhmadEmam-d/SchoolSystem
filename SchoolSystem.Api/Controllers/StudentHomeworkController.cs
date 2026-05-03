using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Application.Features.StudentHomeworks.Commands.SubmitHomework;
using SchoolSystem.Application.Features.StudentHomeworks.DTOs;
using SchoolSystem.Application.Features.StudentHomeworks.Queries.GetHomeworkDetails;
using SchoolSystem.Application.Features.StudentHomeworks.Queries.GetStudentHomeworks;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using SchoolSystem.Infrastructure.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SchoolSystem.API.Controllers
{
    [Route("api/student/homework")]
    [ApiController]
    [Authorize(Roles = "Student")]
    public class StudentHomeworkController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMessageService _messageService;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<HomeworkSubmission> _submissionRepo;
        private readonly IFileService _fileService;

        public StudentHomeworkController(
            IMediator mediator,
            IMessageService messageService,
            IGenericRepository<Student> studentRepo,
            IGenericRepository<HomeworkSubmission> submissionRepo,
            IFileService fileService) // Inject submission repo
        {
            _mediator = mediator;
            _messageService = messageService;
            _studentRepo = studentRepo;
            _submissionRepo = submissionRepo;
            _fileService = fileService;
        }

        [HttpGet]
        public async Task<IActionResult> GetHomeworks([FromQuery] string? status)
        {
            try
            {
                var student = await GetCurrentStudent();
                if (student == null)
                    return Unauthorized();

                var query = new GetStudentHomeworksQuery { StudentId = student.Oid, Status = status };
                var result = await _mediator.Send(query);

                return Ok(ApiResponseFactory.Success(result, "HomeworksFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "HomeworksFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpGet("{homeworkId:guid}")]
        public async Task<IActionResult> GetHomeworkDetails(Guid homeworkId)
        {
            try
            {
                var student = await GetCurrentStudent();
                if (student == null)
                    return Unauthorized();

                var query = new GetHomeworkDetailsQuery { HomeworkId = homeworkId, StudentId = student.Oid };
                var result = await _mediator.Send(query);

                return Ok(ApiResponseFactory.Success(result, "HomeworkDetailsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "HomeworkDetailsFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
        [HttpPost("{homeworkId:guid}/upload-attachment")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadAttachment(Guid homeworkId, IFormFile file)
        {
            try
            {
                var student = await GetCurrentStudent();
                if (student == null)
                    return Unauthorized();

                if (file == null || file.Length == 0)
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "NoFileProvided", _messageService,
                        new List<string> { "File is required." }
                    ));

                // ✅ Use built-in validation from IFileService
                if (!_fileService.IsValidFile(file, out var errorMessage))
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "InvalidFile", _messageService,
                        new List<string> { errorMessage }
                    ));

                // ✅ Correct signature: (IFormFile, entityType, entityId)
                var result = await _fileService.UploadFileAsync(file, "homework", homeworkId);

                return Ok(ApiResponseFactory.Success(new { attachmentUrl = result.FileUrl }, "FileUploadedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "FileUploadFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
        [HttpPost("{homeworkId:guid}/submit")]
        public async Task<IActionResult> SubmitHomework(Guid homeworkId, [FromBody] SubmitHomeworkDto dto)
        {
            try
            {
                var student = await GetCurrentStudent();
                if (student == null)
                    return Unauthorized();

                var command = new SubmitHomeworkCommand
                {
                    HomeworkId = homeworkId,
                    StudentId = student.Oid,
                    SubmissionText = dto.SubmissionText,
                    AttachmentUrl = dto.AttachmentUrl
                };

                var result = await _mediator.Send(command);

                return Ok(ApiResponseFactory.Success(result, "HomeworkSubmittedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "HomeworkSubmissionFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // NEW: Get my submission for a specific homework
        [HttpGet("{homeworkId:guid}/my-submission")]
        public async Task<IActionResult> GetMySubmission(Guid homeworkId)
        {
            try
            {
                var student = await GetCurrentStudent();
                if (student == null)
                    return Unauthorized();

                // Find submission for this homework and student
                var submission = await _submissionRepo.GetAllQueryable()
                    .FirstOrDefaultAsync(s => s.HomeworkOid == homeworkId && s.StudentOid == student.Oid);

                if (submission == null)
                {
                    Console.WriteLine("NoSubmissionFound");
                }

                // Prepare response
                var submissionData = new
                {
                    submissionId = submission.Oid,
                    submission.Content,
                    submission.AttachmentUrl,
                    submission.SubmittedAt,
                    submission.Grade,
                    submission.Feedback,
                    Status = submission.Status.ToString(),
                    submission.GradedAt,
                    IsGraded = submission.Grade.HasValue,
                    CanResubmit = submission.Status == SubmissionStatus.Pending || submission.Status == SubmissionStatus.Late
                };

                return Ok(ApiResponseFactory.Success(submissionData, "SubmissionFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "FetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        // NEW: Get all my submissions (all homework submissions)
        [HttpGet("my-submissions")]
        public async Task<IActionResult> GetAllMySubmissions()
        {
            try
            {
                var student = await GetCurrentStudent();
                if (student == null)
                    return Unauthorized();

                var submissions = await _submissionRepo.GetAllQueryable()
                    .Where(s => s.StudentOid == student.Oid && !s.IsDeleted)
                    .Include(s => s.Homework)
                    .OrderByDescending(s => s.SubmittedAt)
                    .Select(s => new
                    {
                        submissionId = s.Oid,
                        homeworkId = s.HomeworkOid,
                        homeworkTitle = s.Homework != null ? s.Homework.Title : "Unknown",
                        s.SubmittedAt,
                        s.Grade,
                        s.Feedback,
                        Status = s.Status.ToString(),
                        s.AttachmentUrl,
                        s.GradedAt,
                        IsGraded = s.Grade.HasValue
                    })
                    .ToListAsync();

                return Ok(ApiResponseFactory.Success(new
                {
                    Total = submissions.Count,
                    Submissions = submissions
                }, "SubmissionsFetchedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "FetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        private async Task<Student> GetCurrentStudent()
        {
            var userIdClaim = User.FindFirst("UserId") ?? User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                return null;

            return await _studentRepo.GetAllQueryable()
                .FirstOrDefaultAsync(s => s.UserId == userId);
        }
    }
}