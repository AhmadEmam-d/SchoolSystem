using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Common;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Auth.Commands.VerifyOtpAndReset
{
    public class VerifyOtpAndResetCommandHandler : IRequestHandler<VerifyOtpAndResetCommand, QueryResponse<bool>>
    {
        private readonly IGenericRepository<User> _userRepo;
        private readonly IGenericRepository<PasswordResetToken> _tokenRepo;

        public VerifyOtpAndResetCommandHandler(
            IGenericRepository<User> userRepo,
            IGenericRepository<PasswordResetToken> tokenRepo)
        {
            _userRepo = userRepo;
            _tokenRepo = tokenRepo;
        }

        public async Task<QueryResponse<bool>> Handle(VerifyOtpAndResetCommand request, CancellationToken cancellationToken)
        {
            var token = await _tokenRepo.GetAllQueryable()
                .FirstOrDefaultAsync(t => t.Email == request.Email &&
                                          t.Token == request.OtpCode &&
                                          !t.IsUsed &&
                                          t.ExpiresAt > DateTime.UtcNow, cancellationToken);

            if (token == null)
            {
                return new QueryResponse<bool>
                {
                    Success = false,
                    Message = "Invalid or expired reset code.",
                    Data = new List<bool>(),
                    TotalItems = 0,
                    TotalPages = 0
                };
            }

            var user = await _userRepo.GetAllQueryable()
                .FirstOrDefaultAsync(u => u.Email == request.Email && !u.IsDeleted, cancellationToken);

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

            // تحديث كلمة المرور
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepo.UpdateAsync(user);

            // تعليم الـ OTP كمستخدم
            token.IsUsed = true;
            token.UpdatedAt = DateTime.UtcNow;
            await _tokenRepo.UpdateAsync(token);

            return new QueryResponse<bool>
            {
                Success = true,
                Message = "Password reset successfully.",
                Data = new List<bool> { true },
                TotalItems = 1,
                TotalPages = 1
            };
        }
    }
}