using System;

namespace SchoolSystem.Application.Interfaces.Services
{
    public interface ICurrentUserService
    {
        Guid? UserId { get; }
        string Email { get; }
        string Role { get; }
        string Name { get; }
        bool IsAuthenticated { get; }
    }
}