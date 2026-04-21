// Application/Interfaces/Services/IFileService.cs
using Microsoft.AspNetCore.Http;
using SchoolSystem.Application.Common.Models;

namespace SchoolSystem.Application.Interfaces.Services
{
    public interface IFileService
    {
        Task<SchoolSystem.Application.Common.Models.FileUploadResult> UploadFileAsync(
            IFormFile file, string entityType, Guid? entityId = null);

        Task<List<SchoolSystem.Application.Common.Models.FileUploadResult>> UploadMultipleFilesAsync(
            List<IFormFile> files, string entityType, Guid? entityId = null);

        Task<bool> DeleteFileAsync(string fileUrl);

        Task<bool> DeleteEntityFilesAsync(string entityType, Guid entityId);

        Task<List<SchoolSystem.Application.Common.Models.FileUploadResult>> GetEntityFilesAsync(
            string entityType, Guid entityId);

        bool IsValidFile(IFormFile file, out string errorMessage);
    }
}