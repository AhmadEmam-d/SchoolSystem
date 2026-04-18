using MediatR;
using SchoolSystem.Application.Common;

namespace SchoolSystem.Application.Features.Auth.Commands.ForgotPassword
{
    public class ForgotPasswordCommand : IRequest<QueryResponse<bool>>
    {
        public string Email { get; set; }
    }
}