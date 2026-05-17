// Application/Interfaces/Services/IFileStorageService.cs
using System.IO;  

namespace SchoolSystem.Application.Interfaces.Services
{
    public interface IFileStorageService
    {
        Task<FileUploadResult> UploadAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken = default);
        Task DeleteAsync(string fileUrl, CancellationToken cancellationToken = default);
    }

    public class FileUploadResult
    {
        public string FileUrl { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string OriginalName { get; set; } = string.Empty;
    }
}