using SchoolSystem.Application.Features.Settings.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Interfaces.Services
{
    public interface IAuditService
    {
        Task LogAsync(string action, string entity, string? oldValue, string? newValue);
        Task<List<AuditLogDto>> GetAuditLogsAsync(DateTime? fromDate, DateTime? toDate, string? action, int pageNumber, int pageSize);
    }
}