using Azure;
using MediatR;
using SchoolSystem.Application.Common;
using SchoolSystem.Application.Features.UserProfile.DTOs;

namespace SchoolSystem.Application.Features.UserProfile.Commands
{
    public record ChangeUserPasswordCommand(ChangeUserPasswordDto PasswordData) : IRequest<QueryResponse<bool>>;
}