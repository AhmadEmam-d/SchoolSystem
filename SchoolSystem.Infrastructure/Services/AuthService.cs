using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SchoolSystem.Application.Features.Auth.DTOs;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SchoolSystem.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly IGenericRepository<User> _userRepo;
        private readonly IConfiguration _configuration;

        public AuthService(IGenericRepository<User> userRepo, IConfiguration configuration)
        {
            _userRepo = userRepo;
            _configuration = configuration;
        }

        public async Task<List<RoleDto>> GetAllRolesAsync()
        {
            var roles = new List<RoleDto>
            {
                new RoleDto
                {
                    Role = UserRole.Admin,
                    Name = "Admin",
                    Title = "Administrator",
                    Description = "Full control over Edu Smart, students, teachers, and reports",
                    Icon = "fas fa-user-cog",
                    Color = "#4e73df"
                },
                new RoleDto
                {
                    Role = UserRole.Teacher,
                    Name = "Teacher",
                    Title = "Teacher",
                    Description = "Manage classes, take attendance, and grade assignments",
                    Icon = "fas fa-chalkboard-teacher",
                    Color = "#1cc88a"
                },
                new RoleDto
                {
                    Role = UserRole.Student,
                    Name = "Student",
                    Title = "Student",
                    Description = "Access lessons, submit homework, and view your grades",
                    Icon = "fas fa-user-graduate",
                    Color = "#36b9cc"
                },
                new RoleDto
                {
                    Role = UserRole.Parent,
                    Name = "Parent",
                    Title = "Parent / Guardian",
                    Description = "Monitor your child's attendance, grades, and school activities",
                    Icon = "fas fa-users",
                    Color = "#f6c23e"
                }
            };

            return await Task.FromResult(roles);
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            // البحث عن المستخدم بالإيميل
            var user = await _userRepo
                .GetAllQueryable()
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
                throw new Exception("Invalid email or password");

            // التحقق من صحة كلمة المرور (هنا هتستخدمي hashing)
            if (user.PasswordHash != loginDto.Password) // مؤقت - لازم يكون hashing
                throw new Exception("Invalid email or password");

            // التحقق من الدور
            if (user.Role != loginDto.Role)
                throw new Exception($"You are not registered as {loginDto.Role}");

            // التحقق من أن الحساب نشط
            if (!user.IsActive)
                throw new Exception("Account is deactivated");

            // تحديث آخر تسجيل دخول
            user.LastLoginAt = DateTime.UtcNow;
            await _userRepo.UpdateAsync(user);

            // إنشاء token
            var token = GenerateJwtToken(user);

            // تحديد رابط إعادة التوجيه
            var redirectTo = GetRedirectUrl(user.Role);

            return new AuthResponseDto
            {
                UserId = user.Oid,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                Token = token,
                RedirectTo = redirectTo
            };
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            try
            {
                // التحقق من عدم وجود المستخدم
                var existingUser = await _userRepo
                    .GetAllQueryable()
                    .FirstOrDefaultAsync(u => u.Email == registerDto.Email);

                if (existingUser != null)
                    throw new Exception("User already exists");

                // إنشاء مستخدم جديد
                var user = new User
                {
                    FullName = registerDto.FullName,
                    Email = registerDto.Email,
                    PasswordHash = registerDto.Password, // مؤقت - لازم يكون hashing
                    PhoneNumber = registerDto.PhoneNumber,
                    Role = registerDto.Role,
                    IsActive = true
                };

                await _userRepo.AddAsync(user);

                // إنشاء token
                var token = GenerateJwtToken(user);
                var redirectTo = GetRedirectUrl(user.Role);

                return new AuthResponseDto
                {
                    UserId = user.Oid,
                    FullName = user.FullName,
                    Email = user.Email,
                    Role = user.Role,
                    Token = token,
                    RedirectTo = redirectTo
                };
            }
            catch (Exception ex)
            {
                // هذا سيعرض الخطأ الحقيقي
                throw new Exception($"Registration failed: {ex.Message} - Inner: {ex.InnerException?.Message}");
            }
        }
        public async Task<bool> LogoutAsync(string email)
        {
            // يمكن إضافة أي منطق للتسجيل الخروج (مثل إضافة token للـ blacklist)
            return await Task.FromResult(true);
        }

        public async Task<UserDto> GetUserByEmailAsync(string email)
        {
            var user = await _userRepo
                .GetAllQueryable()
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                return null;

            return new UserDto
            {
                Oid = user.Oid,
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role,
                IsActive = user.IsActive,
                LastLoginAt = user.LastLoginAt
            };
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Oid.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim("role", user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"] ?? "YourSuperSecretKeyForJWTTokenGeneration"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(7);

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GetRedirectUrl(UserRole role)
        {
            return role switch
            {
                UserRole.Admin => "/dashboard/admin",
                UserRole.Teacher => "/dashboard/teacher",
                UserRole.Student => "/dashboard/student",
                UserRole.Parent => "/dashboard/parent",
                _ => "/dashboard"
            };
        }
    }
}