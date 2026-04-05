// Application/Features/Profile/Queries/GetUserProfileQuery.cs
using MediatR;
using SchoolSystem.Application.Common;
using SchoolSystem.Application.Features.UserProfile.DTOs;

namespace SchoolSystem.Application.Features.UserProfile.Queries
{
    public record GetUserProfileQuery : IRequest<QueryResponse<UserProfileDto>>;
}