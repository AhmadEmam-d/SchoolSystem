using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Api.Common.Helpers;
using SchoolSystem.Api.Common.Models;
using SchoolSystem.Application.Features.Materials.Commands;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Teacher,Admin")]
    public class FilesController : ControllerBase
    {
        private readonly IFileService _fileService;
        private readonly IMediator _mediator;
        private readonly IGenericRepository<Material> _materialRepo;
        private readonly IMessageService _messageService;

        public FilesController(
            IFileService fileService,
            IMediator mediator,
            IGenericRepository<Material> materialRepo,
            IMessageService messageService)
        {
            _fileService = fileService;
            _mediator = mediator;
            _materialRepo = materialRepo;
            _messageService = messageService;
        }

        [HttpPost("upload/{entityType}/{entityId:guid}")]
        public async Task<IActionResult> Upload(
            [FromRoute] string entityType,
            [FromRoute] Guid entityId,
            [FromForm] FileUploadRequest request)
        {
            try
            {
                if (request?.File == null || request.File.Length == 0)
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "NoFileProvided", _messageService, null
                    ));

                var result = await _fileService.UploadFileAsync(request.File, entityType.ToLower(), entityId);

                switch (entityType.ToLower())
                {
                    case "lesson":
                        await _mediator.Send(new AddMaterialCommand
                        {
                            LessonOid = entityId,
                            EntityType = "lesson",
                            Name = result.Name,
                            FileUrl = result.FileUrl,
                            FileType = result.FileType,
                            FileSize = result.FileSize
                        });
                        break;

                    case "exams":
                    case "exam":
                        await _mediator.Send(new AddMaterialCommand
                        {
                            ExamOid = entityId,
                            EntityType = "exam",
                            Name = result.Name,
                            FileUrl = result.FileUrl,
                            FileType = result.FileType,
                            FileSize = result.FileSize
                        });
                        break;

                    case "homework":
                        await _mediator.Send(new AddMaterialCommand
                        {
                            HomeworkOid = entityId,
                            EntityType = "homework",
                            Name = result.Name,
                            FileUrl = result.FileUrl,
                            FileType = result.FileType,
                            FileSize = result.FileSize
                        });
                        break;

                    default:
                        return BadRequest(ApiResponseFactory.Failure<object>(
                            "UnsupportedEntityType", _messageService,
                            new List<string> { "Valid types are: lesson, exam, homework." }
                        ));
                }

                return Ok(ApiResponseFactory.Success(result, "FileUploadedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "FileUploadFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpPost("upload-multiple/{entityType}/{entityId:guid}")]
        public async Task<IActionResult> UploadMultiple(
            [FromRoute] string entityType,
            [FromRoute] Guid entityId,
            [FromForm] MultipleFilesUploadRequest request)
        {
            try
            {
                if (request?.Files == null || request.Files.Count == 0)
                    return BadRequest(ApiResponseFactory.Failure<object>(
                        "NoFilesProvided", _messageService, null
                    ));

                var results = await _fileService.UploadMultipleFilesAsync(
                    request.Files, entityType.ToLower(), entityId);

                switch (entityType.ToLower())
                {
                    case "lessons":
                    case "lesson":
                        foreach (var result in results)
                            await _mediator.Send(new AddMaterialCommand
                            {
                                LessonOid = entityId,
                                EntityType = "lesson",
                                Name = result.Name,
                                FileUrl = result.FileUrl,
                                FileType = result.FileType,
                                FileSize = result.FileSize
                            });
                        break;

                    case "exams":
                    case "exam":
                        foreach (var result in results)
                            await _mediator.Send(new AddMaterialCommand
                            {
                                ExamOid = entityId,
                                EntityType = "exam",
                                Name = result.Name,
                                FileUrl = result.FileUrl,
                                FileType = result.FileType,
                                FileSize = result.FileSize
                            });
                        break;

                    case "homework":
                        foreach (var result in results)
                            await _mediator.Send(new AddMaterialCommand
                            {
                                HomeworkOid = entityId,
                                EntityType = "homework",
                                Name = result.Name,
                                FileUrl = result.FileUrl,
                                FileType = result.FileType,
                                FileSize = result.FileSize
                            });
                        break;

                    default:
                        return BadRequest(ApiResponseFactory.Failure<object>(
                            "UnsupportedEntityType", _messageService,
                            new List<string> { "Valid types are: lesson, exam, homework." }
                        ));
                }

                return Ok(ApiResponseFactory.Success(
                    new { data = results, count = results.Count },
                    "FilesUploadedSuccessfully", _messageService
                ));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "FilesUploadFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpGet("{entityType}/{entityId:guid}")]
        public async Task<IActionResult> GetEntityFiles(
            [FromRoute] string entityType,
            [FromRoute] Guid entityId)
        {
            try
            {
                var files = await _fileService.GetEntityFilesAsync(entityType.ToLower(), entityId);
                return Ok(ApiResponseFactory.Success(
                    new { data = files, count = files.Count },
                    "FilesFetchedSuccessfully", _messageService
                ));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "FilesFetchFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }

        [HttpDelete("material/{materialOid:guid}")]
        public async Task<IActionResult> DeleteMaterial(Guid materialOid)
        {
            try
            {
                var material = await _materialRepo.GetByOidAsync(materialOid);
                if (material == null)
                    return NotFound(ApiResponseFactory.Failure<object>(
                        "MaterialNotFound", _messageService, null
                    ));

                await _fileService.DeleteFileAsync(material.FileUrl);
                await _materialRepo.DeleteAsync(materialOid);

                return Ok(ApiResponseFactory.Success(true, "MaterialDeletedSuccessfully", _messageService));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponseFactory.Failure<object>(
                    "MaterialDeleteFailed", _messageService,
                    new List<string> { ex.Message }
                ));
            }
        }
    }

    public class FileUploadRequest
    {
        public IFormFile? File { get; set; }
    }

    public class MultipleFilesUploadRequest
    {
        public List<IFormFile>? Files { get; set; }
    }
}