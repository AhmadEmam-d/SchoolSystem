// Application/Features/Profile/Handlers/UpdateUserProfileCommandHandler.cs
using MediatR;
using SchoolSystem.Application.Common;
using SchoolSystem.Application.Features.Profile.Commands;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Profile.Commands
{
    public class UpdateUserProfileCommandHandler : IRequestHandler<UpdateUserProfileCommand, QueryResponse<bool>>
    {
        private readonly IGenericRepository<User> _userRepository;
        private readonly ICurrentUserService _currentUserService;

        public UpdateUserProfileCommandHandler(IGenericRepository<User> userRepository, ICurrentUserService currentUserService)
        {
            _userRepository = userRepository;
            _currentUserService = currentUserService;
        }

        public async Task<QueryResponse<bool>> Handle(UpdateUserProfileCommand request, CancellationToken cancellationToken)
        {
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

            user.FullName = request.ProfileData.FullName;
            user.PhoneNumber = request.ProfileData.Phone;
            user.Department = request.ProfileData.Department;
            user.Position = request.ProfileData.Position;
            user.Avatar = request.ProfileData.Avatar;
            user.UpdatedAt = System.DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);

            return new QueryResponse<bool>
            {
                Success = true,
                Message = "Profile updated successfully",
                Data = new List<bool> { true },
                TotalItems = 1,
                TotalPages = 1
            };
        }
    }
}