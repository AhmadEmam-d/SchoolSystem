// Infrastructure/Services/FileService.cs
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using SchoolSystem.Application.Common.Models;
using SchoolSystem.Application.Interfaces.Services;

namespace SchoolSystem.Infrastructure.Services
{
    public class FileService : IFileService
    {
        private readonly IHostEnvironment _environment;
        private readonly Dictionary<string, string> _entityFolders = new()
        {
            { "lessons", "lessons" },
            { "exams", "exams" },
            { "homework", "homework" },
            { "messages", "messages" },
            { "assignments", "assignments" },
            { "resources", "resources" },
            { "profile", "profiles" }
        };

        public FileService(IHostEnvironment environment)
        {
            _environment = environment;
        }

        public async Task<FileUploadResult> UploadFileAsync(
            IFormFile file,
            string entityType,
            Guid? entityId = null)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file provided");

            if (!IsValidFile(file, out string errorMessage))
                throw new ArgumentException(errorMessage);

            // Get folder name for entity type
            var folderName = _entityFolders.ContainsKey(entityType)
                ? _entityFolders[entityType]
                : "others";

            // Create folder structure: uploads/{entityType}/{entityId}/ (optional)
            var uploadsPath = Path.Combine(
                _environment.ContentRootPath,
                "wwwroot",
                "uploads",
                folderName
            );

            if (entityId.HasValue)
            {
                uploadsPath = Path.Combine(uploadsPath, entityId.Value.ToString());
            }

            if (!Directory.Exists(uploadsPath))
                Directory.CreateDirectory(uploadsPath);

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var savedFileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsPath, savedFileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            // Build file URL
            var fileUrl = entityId.HasValue
                ? $"/uploads/{folderName}/{entityId}/{savedFileName}"
                : $"/uploads/{folderName}/{savedFileName}";

            return new FileUploadResult
            {
                Name = file.FileName,
                FileUrl = fileUrl,
                FileType = file.ContentType,
                FileSize = file.Length,
                EntityType = entityType,
                EntityId = entityId
            };
        }

        public async Task<List<FileUploadResult>> UploadMultipleFilesAsync(
            List<IFormFile> files,
            string entityType,
            Guid? entityId = null)
        {
            var results = new List<FileUploadResult>();

            foreach (var file in files)
            {
                var uploaded = await UploadFileAsync(file, entityType, entityId);
                results.Add(uploaded);
            }

            return results;
        }

        public async Task<bool> DeleteFileAsync(string fileUrl)
        {
            try
            {
                var relativePath = fileUrl.TrimStart('/');
                var filePath = Path.Combine(_environment.ContentRootPath, relativePath);

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }

                return await Task.FromResult(true);
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeleteEntityFilesAsync(string entityType, Guid entityId)
        {
            try
            {
                var folderName = _entityFolders.ContainsKey(entityType)
                    ? _entityFolders[entityType]
                    : "others";

                var entityFolder = Path.Combine(
                    _environment.ContentRootPath,
                    "wwwroot",
                    "uploads",
                    folderName,
                    entityId.ToString()
                );

                if (Directory.Exists(entityFolder))
                {
                    Directory.Delete(entityFolder, true);
                }

                return await Task.FromResult(true);
            }
            catch
            {
                return false;
            }
        }

        public async Task<List<FileUploadResult>> GetEntityFilesAsync(string entityType, Guid entityId)
        {
            var results = new List<FileUploadResult>();

            var folderName = _entityFolders.ContainsKey(entityType)
                ? _entityFolders[entityType]
                : "others";

            var entityFolder = Path.Combine(
                _environment.ContentRootPath,
                "wwwroot",
                "uploads",
                folderName,
                entityId.ToString()
            );

            if (Directory.Exists(entityFolder))
            {
                var files = Directory.GetFiles(entityFolder);
                foreach (var file in files)
                {
                    var fileInfo = new FileInfo(file);
                    results.Add(new FileUploadResult
                    {
                        Name = fileInfo.Name,
                        FileUrl = $"/uploads/{folderName}/{entityId}/{fileInfo.Name}",
                        FileType = GetContentType(fileInfo.Extension),
                        FileSize = fileInfo.Length,
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
            {
                errorMessage = "No file provided";
                return false;
            }

            if (file.Length > 10 * 1024 * 1024)
            {
                errorMessage = "File size exceeds 10MB limit";
                return false;
            }

            var allowedExtensions = new[] {
                ".jpg", ".jpeg", ".png", ".gif", ".pdf",
                ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
                ".txt", ".zip", ".rar", ".mp4", ".mp3"
            };

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
            {
                errorMessage = $"File type {extension} is not allowed";
                return false;
            }

            return true;
        }

        private string GetContentType(string extension)
        {
            return extension.ToLower() switch
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
}