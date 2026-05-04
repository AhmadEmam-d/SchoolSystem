// API/Controllers/FilesController.cs
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        public FilesController(IFileService fileService, IMediator mediator, IGenericRepository<Material> materialRepo)
        {
            _fileService = fileService;
            _mediator = mediator;
            _materialRepo = materialRepo;
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
                    case "lesson":
                        foreach (var result in results)
                        {
                            await _mediator.Send(new AddMaterialCommand
                            {
                                LessonOid = entityId,
                                EntityType = "lesson",
                                Name = result.Name,
                                FileUrl = result.FileUrl,
                                FileType = result.FileType,
                                FileSize = result.FileSize
                            });
                        }
                        break;

                    case "exams":
                    case "exam":
                        foreach (var result in results)
                        {
                            await _mediator.Send(new AddMaterialCommand
                            {
                                ExamOid = entityId,
                                EntityType = "exam",
                                Name = result.Name,
                                FileUrl = result.FileUrl,
                                FileType = result.FileType,
                                FileSize = result.FileSize
                            });
                        }
                        break;

                    case "homework":
                        foreach (var result in results)
                        {
                            await _mediator.Send(new AddMaterialCommand
                            {
                                HomeworkOid = entityId,
                                EntityType = "homework",
                                Name = result.Name,
                                FileUrl = result.FileUrl,
                                FileType = result.FileType,
                                FileSize = result.FileSize
                            });
                        }
                        break;

                    default:
                        return BadRequest(new { success = false, error = $"Unsupported entity type: {entityType}" });
                }

                return Ok(new { success = true, data = results, count = results.Count });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        //// Single delete method with optional parameters
        //[HttpDelete("delete")]
        //public async Task<IActionResult> Delete(
        //    [FromQuery] string fileUrl,
        //    [FromQuery] Guid? entityId = null,
        //    [FromQuery] string entityType = null)
        //{
        //    try
        //    {
        //        if (string.IsNullOrWhiteSpace(fileUrl))
        //            return BadRequest(new { success = false, error = "File URL is required" });

        //        // Delete physical file from disk
        //        var fileDeleted = await _fileService.DeleteFileAsync(fileUrl);

        //        bool dbDeleted = false;

        //        // Delete database record if entity info is provided
        //        if (fileDeleted && entityId.HasValue && !string.IsNullOrWhiteSpace(entityType))
        //        {
        //            switch (entityType.ToLower())
        //            {
        //                case "exam":
        //                case "exams":
        //                    dbDeleted = await _mediator.Send(new DeleteMaterialCommand
        //                    {
        //                        ExamOid = entityId.Value,
        //                        FileUrl = fileUrl
        //                    });
        //                    break;
        //                case "lesson":
        //                    dbDeleted = await _mediator.Send(new DeleteMaterialCommand
        //                    {
        //                        LessonOid = entityId.Value,
        //                        FileUrl = fileUrl
        //                    });
        //                    break;
        //                case "homework":
        //                    dbDeleted = await _mediator.Send(new DeleteMaterialCommand
        //                    {
        //                        HomeworkOid = entityId.Value,
        //                        FileUrl = fileUrl
        //                    });
        //                    break;
        //            }
        //        }

        //        return Ok(new { success = fileDeleted && (dbDeleted || !entityId.HasValue), fileDeleted, dbDeleted });
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new { success = false, error = ex.Message });
        //    }
        //}

        //[HttpDelete("delete/{entityType}/{entityId:guid}")]
        //public async Task<IActionResult> DeleteEntityFiles(
        //    [FromRoute] string entityType,
        //    [FromRoute] Guid entityId)
        //{
        //    try
        //    {
        //        // Get all files first to know what to delete
        //        var files = await _fileService.GetEntityFilesAsync(entityType.ToLower(), entityId);

        //        // Delete physical files from disk
        //        var filesDeleted = await _fileService.DeleteEntityFilesAsync(entityType.ToLower(), entityId);

        //        // Delete database records
        //        bool dbDeleted = false;

        //        switch (entityType.ToLower())
        //        {
        //            case "exam":
        //            case "exams":
        //                dbDeleted = await _mediator.Send(new DeleteMaterialCommand
        //                {
        //                    ExamOid = entityId,
        //                    DeleteAllForEntity = true
        //                });
        //                break;
        //            case "lesson":
        //                dbDeleted = await _mediator.Send(new DeleteMaterialCommand
        //                {
        //                    LessonOid = entityId,
        //                    DeleteAllForEntity = true
        //                });
        //                break;
        //            case "homework":
        //                dbDeleted = await _mediator.Send(new DeleteMaterialCommand
        //                {
        //                    HomeworkOid = entityId,
        //                    DeleteAllForEntity = true
        //                });
        //                break;
        //        }

        //        return Ok(new { success = filesDeleted && dbDeleted, filesDeleted, dbDeleted, filesCount = files.Count });
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new { success = false, error = ex.Message });
        //    }
        //}

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
        [HttpDelete("material/{materialOid:guid}")]
        public async Task<IActionResult> DeleteMaterial(Guid materialOid)
        {
            try
            {
                // Get the material to get the file URL for physical deletion
                var material = await _materialRepo.GetByOidAsync(materialOid);
                if (material == null)
                    return NotFound(new { success = false, error = "Material not found" });

                // Delete physical file from disk
                await _fileService.DeleteFileAsync(material.FileUrl);

                // Delete from database
                await _materialRepo.DeleteAsync(materialOid);

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
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