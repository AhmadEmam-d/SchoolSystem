using MediatR;
using SchoolSystem.Application.Common;

namespace SchoolSystem.Application.Features.Auth.Commands.VerifyOtpAndReset
{
    public class VerifyOtpAndResetCommand : IRequest<QueryResponse<bool>>
    {
        public string Email { get; set; } = string.Empty;
        public string OtpCode { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}