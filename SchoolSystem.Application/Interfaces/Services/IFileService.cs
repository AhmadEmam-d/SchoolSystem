// Application/Interfaces/Services/IFileService.cs
using Microsoft.AspNetCore.Http;
using SchoolSystem.Application.Common.Models;

namespace SchoolSystem.Application.Interfaces.Services
{
    public interface IFileService
    {
        // Generic upload for any entity
        Task<FileUploadResult> UploadFileAsync(
            IFormFile file,
            string entityType,  // "lessons", "exams", "homework", "messages", etc.
            Guid? entityId = null  // Optional: link to specific entity
        );

        Task<List<FileUploadResult>> UploadMultipleFilesAsync(
            List<IFormFile> files,
            string entityType,
            Guid? entityId = null
        );

        Task<bool> DeleteFileAsync(string fileUrl);

        Task<bool> DeleteEntityFilesAsync(string entityType, Guid entityId);

        Task<List<FileUploadResult>> GetEntityFilesAsync(string entityType, Guid entityId);

        bool IsValidFile(IFormFile file, out string errorMessage);
    }
}