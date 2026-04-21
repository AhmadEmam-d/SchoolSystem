// API/Controllers/FilesController.cs
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SchoolSystem.Application.Interfaces.Services;

namespace SchoolSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Teacher,Admin")]
    public class FilesController : ControllerBase
    {
        private readonly IFileService _fileService;
        private readonly IMediator _mediator;

        public FilesController(IFileService fileService, IMediator mediator)
        {
            _fileService = fileService;
            _mediator = mediator;
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
                    return BadRequest(new { success = false, error = "No file provided" });

                var result = await _fileService.UploadFileAsync(request.File, entityType.ToLower(), entityId);

                switch (entityType.ToLower())
                {
                    case "lessons":
                        await _mediator.Send(new AddLessonMaterialCommand
                        {
                            LessonOid = entityId,
                            Name = result.Name,
                            FileUrl = result.FileUrl,
                            FileType = result.FileType,
                            FileSize = result.FileSize
                        });
                        break;

                        // add more cases here when you have other entities
                        // case "exams":
                        // case "homework":
                }

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
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
                    return BadRequest(new { success = false, error = "No files provided" });

                var results = await _fileService.UploadMultipleFilesAsync(
                    request.Files, entityType.ToLower(), entityId);

                switch (entityType.ToLower())
                {
                    case "lessons":
                        foreach (var result in results)
                        {
                            await _mediator.Send(new AddLessonMaterialCommand
                            {
                                LessonOid = entityId,
                                Name = result.Name,
                                FileUrl = result.FileUrl,
                                FileType = result.FileType,
                                FileSize = result.FileSize
                            });
                        }
                        break;
                }

                return Ok(new { success = true, data = results, count = results.Count });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> Delete([FromQuery] string fileUrl)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(fileUrl))
                    return BadRequest(new { success = false, error = "File URL is required" });

                var deleted = await _fileService.DeleteFileAsync(fileUrl);
                return Ok(new { success = deleted });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        [HttpDelete("delete/{entityType}/{entityId:guid}")]
        public async Task<IActionResult> DeleteEntityFiles(
            [FromRoute] string entityType,
            [FromRoute] Guid entityId)
        {
            try
            {
                var deleted = await _fileService.DeleteEntityFilesAsync(entityType.ToLower(), entityId);
                return Ok(new { success = deleted });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
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
                return Ok(new { success = true, data = files, count = files.Count });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }
    }

    public class FileUploadRequest
    {
        public IFormFile File { get; set; }
    }

    public class MultipleFilesUploadRequest
    {
        public List<IFormFile> Files { get; set; }
    }
}