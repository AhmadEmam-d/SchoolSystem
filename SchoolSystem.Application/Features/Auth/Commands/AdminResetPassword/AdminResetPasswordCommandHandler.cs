using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Common;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Auth.Commands.AdminResetPassword
{
    public class AdminResetPasswordCommandHandler : IRequestHandler<AdminResetPasswordCommand, QueryResponse<bool>>
    {
        private readonly IGenericRepository<User> _userRepo;

        public AdminResetPasswordCommandHandler(IGenericRepository<User> userRepo)
        {
            _userRepo = userRepo;
        }

        public async Task<QueryResponse<bool>> Handle(AdminResetPasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepo.GetByOidAsync(request.UserId);
            if (user == null)
            {
                return new QueryResponse<bool>
                {
                    Success = false,
                    Message = "User not found.",
                    Data = new List<bool>(),
                    TotalItems = 0,
                    TotalPages = 0
                };
            }

            // إعادة تعيين إلى كلمة المرور الافتراضية "TempPassword123!"
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword("TempPassword123!");
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepo.UpdateAsync(user);

            return new QueryResponse<bool>
            {
                Success = true,
                Message = "Password has been reset to default: TempPassword123!",
                Data = new List<bool> { true },
                TotalItems = 1,
                TotalPages = 1
            };
        }
    }
}