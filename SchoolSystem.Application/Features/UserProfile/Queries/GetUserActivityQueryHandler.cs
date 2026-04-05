// Application/Features/Profile/Handlers/GetUserActivityQueryHandler.cs
using MediatR;
using SchoolSystem.Application.Common;
using SchoolSystem.Application.Features.UserProfile.DTOs;
using SchoolSystem.Application.Features.UserProfile.Queries;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.UserProfile.Queries
{
    public class GetUserActivityQueryHandler : IRequestHandler<GetUserActivityQuery, QueryResponse<UserActivityDto>>
    {
        private readonly IGenericRepository<AuditLog> _auditLogRepository;
        private readonly ICurrentUserService _currentUserService;

        public GetUserActivityQueryHandler(IGenericRepository<AuditLog> auditLogRepository, ICurrentUserService currentUserService)
        {
            _auditLogRepository = auditLogRepository;
            _currentUserService = currentUserService;
        }

        public async Task<QueryResponse<UserActivityDto>> Handle(GetUserActivityQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;
            if (!userId.HasValue)
            {
                return new QueryResponse<UserActivityDto>
                {
                    Success = false,
                    Message = "User not authenticated",
                    Data = new List<UserActivityDto>(),
                    TotalItems = 0,
                    TotalPages = 0
                };
            }

            var userEmail = _currentUserService.Email;

            // جلب آخر 10 نشاطات للمستخدم
            var allLogs = await _auditLogRepository.GetAllAsync();
            var userActivities = allLogs
                .Where(l => l.PerformedBy == userEmail)
                .OrderByDescending(l => l.PerformedAt)
                .Take(10)
                .Select(l => new UserActivityDto
                {
                    Action = l.Action,
                    Description = GetActivityDescription(l.Action, l.Entity),
                    PerformedAt = l.PerformedAt,
                    IpAddress = l.IpAddress
                })
                .ToList();

            return new QueryResponse<UserActivityDto>
            {
                Success = true,
                Data = userActivities,  // Now List<UserActivityDto> matches List<UserActivityDto>
                TotalItems = userActivities.Count,
                TotalPages = 1
            };
        }

        private string GetActivityDescription(string action, string entity)
        {
            return action switch
            {
                "Login" => "Logged into the system",
                "Logout" => "Logged out of the system",
                "UpdateProfile" => $"Updated {entity} information",
                "ChangePassword" => "Changed account password",
                "UpdateSettings" => "Updated system settings",
                "CreateBackup" => "Created a new backup",
                _ => $"{action} performed on {entity}"
            };
        }
    }
}