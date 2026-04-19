using MediatR;
using SchoolSystem.Application.Common;

namespace SchoolSystem.Application.Features.Auth.Commands.AdminResetPassword
{
    public class AdminResetPasswordCommand : IRequest<QueryResponse<bool>>
    {
        public Guid UserId { get; set; }
    }
}