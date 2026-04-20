// API/Controllers/FilesController.cs - Using wrapper class
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

        public FilesController(IFileService fileService)
        {
            _fileService = fileService;
        }
        // API/Controllers/FilesController.cs
        [HttpPost("upload/{entityType}")]
        public async Task<IActionResult> Upload(
            [FromRoute] string entityType,  // "lessons", "exams", "homework", etc.
            [FromForm] FileUploadRequest request)
        {
            try
            {
                if (request?.File == null || request.File.Length == 0)
                    return BadRequest(new { success = false, error = "No file provided" });

                // ✅ Pass the entity type dynamically
                var result = await _fileService.UploadFileAsync(request.File, entityType);
                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, error = ex.Message });
            }
        }

        [HttpPost("upload-multiple/{entityType}")]
        public async Task<IActionResult> UploadMultiple(
            [FromRoute] string entityType,
            [FromForm] MultipleFilesUploadRequest request)
        {
            try
            {
                if (request?.Files == null || request.Files.Count == 0)
                    return BadRequest(new { success = false, error = "No files provided" });

                var results = new List<object>();
                foreach (var file in request.Files)
                {
                    var uploaded = await _fileService.UploadFileAsync(file, entityType);
                    results.Add(uploaded);
                }

                return Ok(new { success = true, data = results, count = results.Count });
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