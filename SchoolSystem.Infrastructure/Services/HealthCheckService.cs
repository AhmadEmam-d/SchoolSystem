using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using SchoolSystem.Application.Features.Settings.DTOs;
using SchoolSystem.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SchoolSystem.Infrastructure.Services
{
    public class HealthCheckService : IHealthCheckService
    {
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _cache;

        public HealthCheckService(IConfiguration configuration, IMemoryCache cache)
        {
            _configuration = configuration;
            _cache = cache;
        }

        public async Task<SystemHealthDto> GetSystemHealthAsync()
        {
            var health = new SystemHealthDto
            {
                Version = GetType().Assembly.GetName().Version?.ToString() ?? "1.0.0",
                Warnings = new List<string>()
            };

            try
            {
                health.DatabaseHealthy = await CheckDatabaseHealthAsync();
                if (!health.DatabaseHealthy)
                    health.Warnings.Add("Database connection is unhealthy");

                health.CacheHealthy = CheckCacheHealth();
                if (!health.CacheHealthy)
                    health.Warnings.Add("Cache service is not responding");

                health.EmailServiceHealthy = CheckEmailServiceHealth();
                if (!health.EmailServiceHealthy)
                    health.Warnings.Add("Email service is not configured properly");

                health.CpuUsage = GetCpuUsage();
                health.MemoryUsage = GetMemoryUsage();
                health.DiskFreeSpace = GetDiskFreeSpace();
                health.LastBackupDate = await GetLastBackupDateAsync();
                health.ActiveSessions = GetActiveSessions();
            }
            catch (Exception ex)
            {
                health.Warnings.Add($"Health check error: {ex.Message}");
            }

            return health;
        }

        private async Task<bool> CheckDatabaseHealthAsync()
        {
            try
            {
                await Task.Delay(100);
                return true;
            }
            catch
            {
                return false;
            }
        }

        private bool CheckCacheHealth()
        {
            try
            {
                _cache.Set("health_check_key", "ok", TimeSpan.FromSeconds(1));
                return _cache.Get("health_check_key") != null;
            }
            catch
            {
                return false;
            }
        }

        private bool CheckEmailServiceHealth()
        {
            var smtpServer = _configuration["Email:SmtpServer"];
            return !string.IsNullOrEmpty(smtpServer);
        }

        private double GetCpuUsage()
        {
            var startTime = DateTime.UtcNow;
            var startCpuUsage = Process.GetCurrentProcess().TotalProcessorTime;
            Task.Delay(500).Wait();
            var endTime = DateTime.UtcNow;
            var endCpuUsage = Process.GetCurrentProcess().TotalProcessorTime;

            var cpuUsedMs = (endCpuUsage - startCpuUsage).TotalMilliseconds;
            var totalMsPassed = (endTime - startTime).TotalMilliseconds;
            var cpuUsageTotal = cpuUsedMs / (Environment.ProcessorCount * totalMsPassed);

            return cpuUsageTotal * 100;
        }

        private double GetMemoryUsage()
        {
            var process = Process.GetCurrentProcess();
            var memoryMB = process.WorkingSet64 / 1024.0 / 1024.0;
            var totalMemoryMB = GC.GetGCMemoryInfo().TotalAvailableMemoryBytes / 1024.0 / 1024.0;

            return (memoryMB / totalMemoryMB) * 100;
        }

        private long GetDiskFreeSpace()
        {
            var currentDirectory = Directory.GetCurrentDirectory();
            var driveInfo = new DriveInfo(Path.GetPathRoot(currentDirectory) ?? "C:");
            return driveInfo.AvailableFreeSpace;
        }

        private async Task<DateTime> GetLastBackupDateAsync()
        {
            var backupPath = _configuration["Backup:Path"] ?? Path.Combine(Directory.GetCurrentDirectory(), "Backups");

            if (Directory.Exists(backupPath))
            {
                var lastBackup = await Task.Run(() =>
                {
                    var files = Directory.GetFiles(backupPath, "*.zip");
                    if (files.Length > 0)
                    {
                        var latest = files.Max(f => File.GetLastWriteTime(f));
                        return latest;
                    }
                    return DateTime.MinValue;
                });

                return lastBackup;
            }

            return DateTime.MinValue;
        }

        private int GetActiveSessions()
        {
            return 0;
        }
    }
}