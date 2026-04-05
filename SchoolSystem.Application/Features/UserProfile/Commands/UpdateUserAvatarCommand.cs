using MediatR;
using SchoolSystem.Application.Common;

namespace SchoolSystem.Application.Features.UserProfile.Commands
{
    public record UpdateUserAvatarCommand(string AvatarUrl) : IRequest<QueryResponse<bool>>;
}