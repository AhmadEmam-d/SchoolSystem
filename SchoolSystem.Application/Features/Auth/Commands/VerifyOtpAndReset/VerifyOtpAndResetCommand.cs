using MediatR;
using SchoolSystem.Application.Common;

namespace SchoolSystem.Application.Features.Auth.Commands.VerifyOtpAndReset
{
    public class VerifyOtpAndResetCommand : IRequest<QueryResponse<bool>>
    {
        public string Email { get; set; }
        public string OtpCode { get; set; }
        public string NewPassword { get; set; }
    }
}