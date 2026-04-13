using SchoolSystem.Application.Features.Settings.DTOs;
using System;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Interfaces.Services
{
    public interface IBackupService
    {
        Task<BackupResult> CreateBackupAsync(string backupName, string backupPath);
        Task<bool> RestoreBackupAsync(string backupPath);
        Task<bool> DeleteBackupAsync(string backupPath);
    }

    public interface IHealthCheckService
    {
        Task<SystemHealthDto> GetSystemHealthAsync();
    }

   

    

    public class BackupResult
    {
        public long Size { get; set; }
        public string Path { get; set; } = string.Empty;
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }
    }
}