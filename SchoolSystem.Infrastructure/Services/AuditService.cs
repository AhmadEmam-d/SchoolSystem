// Infrastructure/Services/AuditService.cs
using SchoolSystem.Application.Features.Settings.DTOs;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SchoolSystem.Infrastructure.Services
{
    public class AuditService : IAuditService
    {
        private readonly IGenericRepository<AuditLog> _auditRepo;
        private readonly ICurrentUserService _currentUserService;

        public AuditService(IGenericRepository<AuditLog> auditRepo, ICurrentUserService currentUserService)
        {
            _auditRepo = auditRepo;
            _currentUserService = currentUserService;
        }

        public async Task LogAsync(string action, string entity, string? oldValue, string? newValue)
        {
            var auditLog = new AuditLog
            {
                Oid = Guid.NewGuid(),
                Action = action,
                Entity = entity,
                OldValue = oldValue,
                NewValue = newValue,
                PerformedBy = _currentUserService.Email ?? "System",
                PerformedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            await _auditRepo.AddAsync(auditLog);
        }

        public async Task<List<AuditLogDto>> GetAuditLogsAsync(DateTime? fromDate, DateTime? toDate, string? action, int pageNumber, int pageSize)
        {
            var query = _auditRepo.GetAllQueryable();

            if (fromDate.HasValue)
                query = query.Where(x => x.PerformedAt >= fromDate.Value);
            if (toDate.HasValue)
                query = query.Where(x => x.PerformedAt <= toDate.Value);
            if (!string.IsNullOrEmpty(action))
                query = query.Where(x => x.Action == action);

            var skip = (pageNumber - 1) * pageSize;
            var logs = query.Skip(skip).Take(pageSize).ToList();

            return logs.Select(l => new AuditLogDto
            {
                Oid = l.Oid,
                Action = l.Action,
                Entity = l.Entity,
                OldValue = l.OldValue,
                NewValue = l.NewValue,
                PerformedBy = l.PerformedBy,
                PerformedAt = l.PerformedAt
            }).ToList();
        }
    }
}