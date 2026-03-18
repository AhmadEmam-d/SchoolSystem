using SchoolSystem.Application.Features.Auth.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Interfaces.Services
{
    public interface IAuthService
    {
        Task<List<RoleDto>> GetAllRolesAsync();
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<bool> LogoutAsync(string email);
        Task<UserDto> GetUserByEmailAsync(string email);
    }
}