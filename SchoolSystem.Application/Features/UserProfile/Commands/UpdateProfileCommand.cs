using MediatR;
using SchoolSystem.Application.Common;
using SchoolSystem.Application.Features.UserProfile.DTOs;

public record UpdateUserProfileCommand(UpdateUserProfileDto ProfileData) : IRequest<QueryResponse<bool>>;