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
        private readonly IGenericRepository<Teacher> _teacherRepo; 
        private readonly IGenericRepository<Student> _studentRepo;  
        private readonly IGenericRepository<Parent> _parentRepo;    
        private readonly IConfiguration _configuration;

        public AuthService(
            IGenericRepository<User> userRepo,
            IGenericRepository<Teacher> teacherRepo,  
            IGenericRepository<Student> studentRepo,  
            IGenericRepository<Parent> parentRepo,    
            IConfiguration configuration)
        {
            _userRepo = userRepo;
            _teacherRepo = teacherRepo;
            _studentRepo = studentRepo;
            _parentRepo = parentRepo;
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
            var user = await _userRepo
                .GetAllQueryable()
                        .Include(u => u.Teacher)  
                        .Include(u => u.Student)   
                        .Include(u => u.Parent)   
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
                throw new Exception("Invalid email or password");

            if (user.PasswordHash != loginDto.Password) 
                throw new Exception("Invalid email or password");

            if (user.Role != loginDto.Role)
                throw new Exception($"You are not registered as {loginDto.Role}");

            if (!user.IsActive)
                throw new Exception("Account is deactivated");

            Guid? teacherId = null;
            Guid? studentId = null;
            Guid? parentId = null;

            switch (user.Role)
            {
                case UserRole.Teacher:
                    var teacher = await _teacherRepo
                        .GetAllQueryable()
                        .FirstOrDefaultAsync(t => t.UserId == user.Oid);
                    teacherId = teacher?.Oid;
                    break;

                case UserRole.Student:
                    var student = await _studentRepo
                        .GetAllQueryable()
                        .FirstOrDefaultAsync(s => s.UserId == user.Oid);
                    studentId = student?.Oid;
                    break;

                case UserRole.Parent:
                    var parent = await _parentRepo
                        .GetAllQueryable()
                        .FirstOrDefaultAsync(p => p.UserId == user.Oid);
                    parentId = parent?.Oid;
                    break;
            }

            user.LastLoginAt = DateTime.UtcNow;
            await _userRepo.UpdateAsync(user);

            var token = GenerateJwtToken(user);

            var redirectTo = GetRedirectUrl(user.Role);

            return new AuthResponseDto
            {
                UserId = user.Oid,
                TeacherId = user.Teacher?.Oid,  
                StudentId = user.Student?.Oid,
                ParentId = user.Parent?.Oid,  
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

                var user = new User
                {
                    FullName = registerDto.FullName,
                    Email = registerDto.Email,
                    PasswordHash = registerDto.Password, 
                    PhoneNumber = registerDto.PhoneNumber,
                    Role = registerDto.Role,
                    IsActive = true
                };

                await _userRepo.AddAsync(user);

                Guid? teacherId = null;
                if (registerDto.Role == UserRole.Teacher)
                {
                    var teacher = new Teacher
                    {
                        FullName = registerDto.FullName,
                        Email = registerDto.Email,
                        Phone = registerDto.PhoneNumber ?? "",
                        UserId = user.Oid
                    };
                    await _teacherRepo.AddAsync(teacher);
                    teacherId = teacher.Oid;
                }

                Guid? studentId = null;
                if (registerDto.Role == UserRole.Student)
                {
                    var student = new Student
                    {
                        FullName = registerDto.FullName,
                        Email = registerDto.Email,
                        Phone = registerDto.PhoneNumber ?? "",
                        UserId = user.Oid
                    };
                    await _studentRepo.AddAsync(student);
                    studentId = student.Oid;
                }

                Guid? parentId = null;
                if (registerDto.Role == UserRole.Parent)
                {
                    var parent = new Parent
                    {
                        FatherName = registerDto.FullName,
                        Email = registerDto.Email,
                        Phone = registerDto.PhoneNumber ?? "",
                        UserId = user.Oid
                    };
                    await _parentRepo.AddAsync(parent);
                    parentId = parent.Oid;
                }

                var token = GenerateJwtToken(user);
                var redirectTo = GetRedirectUrl(user.Role);

                return new AuthResponseDto
                {
                    UserId = user.Oid,
                    TeacherId = teacherId,
                    StudentId = studentId,
                    ParentId = parentId,
                    FullName = user.FullName,
                    Email = user.Email,
                    Role = user.Role,
                    Token = token,
                    RedirectTo = redirectTo
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Registration failed: {ex.Message} - Inner: {ex.InnerException?.Message}");
            }
        }

        public async Task<bool> LogoutAsync(string email)
        {
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
                new Claim("role", user.Role.ToString()),
                new Claim("UserId", user.Oid.ToString())  
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