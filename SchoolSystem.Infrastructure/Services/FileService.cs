// Infrastructure/Services/FileService.cs
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;        // IWebHostEnvironment
using SchoolSystem.Application.Common.Models;
using SchoolSystem.Application.Interfaces.Services;

namespace SchoolSystem.Infrastructure.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _environment;  // fix this
        private readonly Dictionary<string, string> _entityFolders = new()
        {
                { "lessons",     "lessons"     },
                { "lesson",      "lessons"     },  // add this
                { "exams",       "exams"       },
                { "exam",        "exams"       },  // add this
                { "homework",    "homework"    },
                { "messages",    "messages"    },
                { "message",     "messages"    },  // add this
                { "assignments", "assignments" },
                { "assignment",  "assignments" },  // add this
                { "resources",   "resources"   },
                { "resource",    "resources"   },  // add this
                { "profile",     "profiles"    }
        };

        public FileService(IWebHostEnvironment environment)  // fix this
        {
            _environment = environment;
        }

        public async Task<Application.Common.Models.FileUploadResult> UploadFileAsync(
            IFormFile file,
            string entityType,
            Guid? entityId = null)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file provided");

            if (!IsValidFile(file, out string errorMessage))
                throw new ArgumentException(errorMessage);

            var folderName = _entityFolders.ContainsKey(entityType)
                ? _entityFolders[entityType]
                : "others";

            var uploadsPath = Path.Combine(
                _environment.WebRootPath ?? _environment.ContentRootPath,
                "uploads",
                folderName
            );

            if (entityId.HasValue)
                uploadsPath = Path.Combine(uploadsPath, entityId.Value.ToString());

            if (!Directory.Exists(uploadsPath))
                Directory.CreateDirectory(uploadsPath);

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var savedFileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsPath, savedFileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            var fileUrl = entityId.HasValue
                ? $"/uploads/{folderName}/{entityId}/{savedFileName}"
                : $"/uploads/{folderName}/{savedFileName}";

            return new Application.Common.Models.FileUploadResult
            {
                Name = file.FileName,
                FileUrl = fileUrl,
                FileType = file.ContentType,
                FileSize = file.Length,
                EntityType = entityType,
                EntityId = entityId
            };
        }

        public async Task<List<Application.Common.Models.FileUploadResult>> UploadMultipleFilesAsync(
            List<IFormFile> files,
            string entityType,
            Guid? entityId = null)
        {
            var results = new List<Application.Common.Models.FileUploadResult>();
            foreach (var file in files)
                results.Add(await UploadFileAsync(file, entityType, entityId));
            return results;
        }

        public async Task<bool> DeleteFileAsync(string fileUrl)
        {
            try
            {
                var relativePath = fileUrl.TrimStart('/');
                var filePath = Path.Combine(
                    _environment.WebRootPath ?? _environment.ContentRootPath,
                    relativePath);

                if (File.Exists(filePath))
                    File.Delete(filePath);

                return await Task.FromResult(true);
            }
            catch { return false; }
        }

        public async Task<bool> DeleteEntityFilesAsync(string entityType, Guid entityId)
        {
            try
            {
                var folderName = _entityFolders.ContainsKey(entityType)
                    ? _entityFolders[entityType]
                    : "others";

                var entityFolder = Path.Combine(
                    _environment.WebRootPath ?? _environment.ContentRootPath,
                    "uploads",
                    folderName,
                    entityId.ToString());

                if (Directory.Exists(entityFolder))
                    Directory.Delete(entityFolder, true);

                return await Task.FromResult(true);
            }
            catch { return false; }
        }

        public async Task<List<Application.Common.Models.FileUploadResult>> GetEntityFilesAsync(string entityType, Guid entityId)
        {
            var results = new List<Application.Common.Models.FileUploadResult>();
            var folderName = _entityFolders.ContainsKey(entityType)
                ? _entityFolders[entityType]
                : "others";

            var entityFolder = Path.Combine(
                _environment.WebRootPath ?? _environment.ContentRootPath,
                "uploads",
                folderName,
                entityId.ToString());

            if (Directory.Exists(entityFolder))
            {
                foreach (var file in Directory.GetFiles(entityFolder))
                {
                    var info = new FileInfo(file);
                    results.Add(new Application.Common.Models.FileUploadResult
                    {
                        Name = info.Name,
                        FileUrl = $"/uploads/{folderName}/{entityId}/{info.Name}",
                        FileType = GetContentType(info.Extension),
                        FileSize = info.Length,
                        EntityType = entityType,
                        EntityId = entityId
                    });
                }
            }

            return await Task.FromResult(results);
        }

        public bool IsValidFile(IFormFile file, out string errorMessage)
        {
            errorMessage = string.Empty;

            if (file == null || file.Length == 0)
            { errorMessage = "No file provided"; return false; }

            if (file.Length > 10 * 1024 * 1024)
            { errorMessage = "File size exceeds 10MB limit"; return false; }

            var allowedExtensions = new[]
            {
                ".jpg", ".jpeg", ".png", ".gif", ".pdf",
                ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
                ".txt", ".zip", ".rar", ".mp4", ".mp3"
            };

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
            { errorMessage = $"File type {extension} is not allowed"; return false; }

            return true;
        }

        private string GetContentType(string extension) => extension.ToLower() switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".pdf" => "application/pdf",
            ".doc" => "application/msword",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".xls" => "application/vnd.ms-excel",
            ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ".mp4" => "video/mp4",
            _ => "application/octet-stream"
        };
    }
}