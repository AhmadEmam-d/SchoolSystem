using Microsoft.Extensions.Configuration;
using SchoolSystem.Application.Interfaces.Services;
using System;
using System.IO;
using System.IO.Compression;
using System.Threading.Tasks;

namespace SchoolSystem.Infrastructure.Services
{
    public class BackupService : IBackupService
    {
        private readonly IConfiguration _configuration;
        private readonly string _backupPath;

        public BackupService(IConfiguration configuration)
        {
            _configuration = configuration;
            _backupPath = _configuration["Backup:Path"] ?? Path.Combine(Directory.GetCurrentDirectory(), "Backups");

            if (!Directory.Exists(_backupPath))
                Directory.CreateDirectory(_backupPath);
        }

        public async Task<BackupResult> CreateBackupAsync(string backupName, string backupPath)
        {
            var result = new BackupResult();

            try
            {
                var fullBackupPath = Path.Combine(_backupPath, backupPath);
                if (!Directory.Exists(fullBackupPath))
                    Directory.CreateDirectory(fullBackupPath);

                var backupFileName = $"{backupName}.zip";
                var backupFile = Path.Combine(fullBackupPath, backupFileName);

                await Task.Delay(1000); 

                using (var archive = ZipFile.Open(backupFile, ZipArchiveMode.Create))
                {
                    var entry = archive.CreateEntry("backup_info.txt");
                    using (var writer = new StreamWriter(entry.Open()))
                    {
                        await writer.WriteLineAsync($"Backup Name: {backupName}");
                        await writer.WriteLineAsync($"Created At: {DateTime.UtcNow}");
                        await writer.WriteLineAsync($"Backup Path: {backupPath}");
                    }
                }

                var fileInfo = new FileInfo(backupFile);
                result.Success = true;
                result.Size = fileInfo.Length;
                result.Path = backupFile;
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.ErrorMessage = ex.Message;
            }

            return result;
        }

        public Task<bool> DeleteBackupAsync(string backupPath)
        {
            try
            {
                if (File.Exists(backupPath))
                {
                    File.Delete(backupPath);
                    return Task.FromResult(true);
                }
                return Task.FromResult(false);
            }
            catch
            {
                return Task.FromResult(false);
            }
        }

        public Task<bool> RestoreBackupAsync(string backupPath)
        {
            try
            {
                if (!File.Exists(backupPath))
                    return Task.FromResult(false);

                return Task.FromResult(true);
            }
            catch
            {
                return Task.FromResult(false);
            }
        }
    }
}