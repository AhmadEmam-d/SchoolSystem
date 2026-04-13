using MediatR;
using SchoolSystem.Application.Common;
using SchoolSystem.Application.Features.UserProfile.Commands;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.UserProfile.Handlers
{
    public class ChangeUserPasswordCommandHandler : IRequestHandler<ChangeUserPasswordCommand, QueryResponse<bool>>
    {
        private readonly IGenericRepository<User> _userRepository;
        private readonly ICurrentUserService _currentUserService;

        public ChangeUserPasswordCommandHandler(IGenericRepository<User> userRepository, ICurrentUserService currentUserService)
        {
            _userRepository = userRepository;
            _currentUserService = currentUserService;
        }

        public async Task<QueryResponse<bool>> Handle(ChangeUserPasswordCommand request, CancellationToken cancellationToken)
        {
            if (request.PasswordData.NewPassword != request.PasswordData.ConfirmPassword)
            {
                return new QueryResponse<bool>
                {
                    Success = false,
                    Message = "New password and confirmation do not match",
                    Data = new List<bool>(),
                    TotalItems = 0,
                    TotalPages = 0
                };
            }

            var userId = _currentUserService.UserId;
            if (!userId.HasValue)
            {
                return new QueryResponse<bool>
                {
                    Success = false,
                    Message = "User not authenticated",
                    Data = new List<bool>(),
                    TotalItems = 0,
                    TotalPages = 0
                };
            }

            var user = await _userRepository.GetByOidAsync(userId.Value);
            if (user == null)
            {
                return new QueryResponse<bool>
                {
                    Success = false,
                    Message = "User not found",
                    Data = new List<bool>(),
                    TotalItems = 0,
                    TotalPages = 0
                };
            }

            bool passwordValid = BCrypt.Net.BCrypt.Verify(request.PasswordData.CurrentPassword, user.PasswordHash);
            if (!passwordValid)
            {
                return new QueryResponse<bool>
                {
                    Success = false,
                    Message = "Current password is incorrect",
                    Data = new List<bool>(),
                    TotalItems = 0,
                    TotalPages = 0
                };
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.PasswordData.NewPassword);
            user.UpdatedAt = System.DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);

            return new QueryResponse<bool>
            {
                Success = true,
                Message = "Password changed successfully",
                Data = new List<bool> { true },
                TotalItems = 1,
                TotalPages = 1
            };
        }
    }
}