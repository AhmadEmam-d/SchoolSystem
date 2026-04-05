// Application/Features/Profile/Handlers/GetUserProfileQueryHandler.cs
using MediatR;
using SchoolSystem.Application.Common;
using SchoolSystem.Application.Features.UserProfile.DTOs;
using SchoolSystem.Application.Features.UserProfile.Queries;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.UserProfile.Queries
{
    public class GetUserProfileQueryHandler : IRequestHandler<GetUserProfileQuery, QueryResponse<UserProfileDto>>
    {
        private readonly IGenericRepository<User> _userRepository;
        private readonly ICurrentUserService _currentUserService;

        public GetUserProfileQueryHandler(IGenericRepository<User> userRepository, ICurrentUserService currentUserService)
        {
            _userRepository = userRepository;
            _currentUserService = currentUserService;
        }

        public async Task<QueryResponse<UserProfileDto>> Handle(GetUserProfileQuery request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.UserId;
            if (!userId.HasValue)
            {
                return new QueryResponse<UserProfileDto>
                {
                    Success = false,
                    Message = "User not authenticated",
                    Data = new List<UserProfileDto>(),
                    TotalItems = 0,
                    TotalPages = 0
                };
            }

            var user = await _userRepository.GetByOidAsync(userId.Value);

            if (user == null)
            {
                return new QueryResponse<UserProfileDto>
                {
                    Success = false,
                    Message = "User not found",
                    Data = new List<UserProfileDto>(),
                    TotalItems = 0,
                    TotalPages = 0
                };
            }

            var profile = new UserProfileDto
            {
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.PhoneNumber,
                Avatar = user.Avatar,
                Department = user.Department ?? GetDefaultDepartment(user.Role),
                Position = user.Position ?? GetDefaultPosition(user.Role),
                EmployeeId = user.EmployeeId ?? GenerateEmployeeId(user.Role)
            };

            return new QueryResponse<UserProfileDto>
            {
                Success = true,
                Data = new List<UserProfileDto> { profile },
                TotalItems = 1,
                TotalPages = 1
            };
        }

        private string GetDefaultDepartment(UserRole role)
        {
            switch (role)
            {
                case UserRole.Admin: return "Administration";
                case UserRole.Teacher: return "Teaching Staff";
                case UserRole.Student: return "Student Affairs";
                case UserRole.Parent: return "Parent Relations";
                default: return "General";
            }
        }

        private string GetDefaultPosition(UserRole role)
        {
            switch (role)
            {
                case UserRole.Admin: return "System Administrator";
                case UserRole.Teacher: return "Teacher";
                case UserRole.Student: return "Student";
                case UserRole.Parent: return "Parent";
                default: return "Staff";
            }
        }

        private string GenerateEmployeeId(UserRole role)
        {
            string prefix;
            switch (role)
            {
                case UserRole.Admin: prefix = "ADM"; break;
                case UserRole.Teacher: prefix = "TCH"; break;
                case UserRole.Student: prefix = "STD"; break;
                case UserRole.Parent: prefix = "PRN"; break;
                default: prefix = "STAFF"; break;
            }
            return $"{prefix}-{DateTime.Now.Year}-{new Random().Next(1000, 9999)}";
        }
    }
}