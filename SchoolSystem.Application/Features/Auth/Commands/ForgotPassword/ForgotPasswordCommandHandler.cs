using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Common;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Auth.Commands.ForgotPassword
{
    public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, QueryResponse<bool>>
    {
        private readonly IGenericRepository<User> _userRepo;
        private readonly IGenericRepository<PasswordResetToken> _tokenRepo;
        private readonly IEmailService _emailService;

        public ForgotPasswordCommandHandler(
            IGenericRepository<User> userRepo,
            IGenericRepository<PasswordResetToken> tokenRepo,
            IEmailService emailService)
        {
            _userRepo = userRepo;
            _tokenRepo = tokenRepo;
            _emailService = emailService;
        }

        public async Task<QueryResponse<bool>> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await _userRepo.GetAllQueryable()
                .FirstOrDefaultAsync(u => u.Email == request.Email && !u.IsDeleted, cancellationToken);

            if (user == null)
            {
                // لأمان النظام، لا نخبر المستخدم بوجود البريد أو لا
                return new QueryResponse<bool>
                {
                    Success = true,
                    Message = "If your email exists, you will receive a reset code."
                };
            }

            // حذف أي أكواد سابقة لنفس البريد
            var oldTokens = await _tokenRepo.GetAllQueryable()
                .Where(t => t.Email == request.Email && !t.IsUsed)
                .ToListAsync(cancellationToken);

            foreach (var oldToken in oldTokens)
            {
                await _tokenRepo.DeleteAsync(oldToken.Oid);
            }

            // إنشاء OTP جديد
            var otpCode = new Random().Next(100000, 999999).ToString();
            var token = new PasswordResetToken
            {
                Oid = Guid.NewGuid(),
                Email = request.Email,
                Token = otpCode,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                IsUsed = false,
                CreatedAt = DateTime.UtcNow
            };
            await _tokenRepo.AddAsync(token);

            // إرسال الإيميل
            var emailBody = $@"
                <h2>Reset Your Password</h2>
                <p>You requested to reset your password. Use the code below:</p>
                <h1 style='font-size: 32px; letter-spacing: 5px;'>{otpCode}</h1>
                <p>This code will expire in 15 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            ";

            await _emailService.SendEmailAsync(request.Email, "Password Reset Code", emailBody);

            return new QueryResponse<bool>
            {
                Success = true,
                Message = "If your email exists, you will receive a reset code.",
                Data = new List<bool> { true },
                TotalItems = 1,
                TotalPages = 1
            };
        }
    }
}