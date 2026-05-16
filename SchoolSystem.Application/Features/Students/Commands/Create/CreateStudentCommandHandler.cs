using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Interfaces.Services;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Students.Commands.Create
{
    public class CreateStudentCommandHandler : IRequestHandler<CreateStudentCommand, Guid>
    {
        private readonly IGenericRepository<User> _userRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;

        public CreateStudentCommandHandler(
            IGenericRepository<User> userRepo,
            IGenericRepository<Student> studentRepo,
            IEmailService emailService,
            IMapper mapper)
        {
            _userRepo = userRepo;
            _studentRepo = studentRepo;
            _emailService = emailService;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(CreateStudentCommand request, CancellationToken cancellationToken)
        {
            var existingUser = await _userRepo.GetAllQueryable()
                .AnyAsync(u => u.Email == request.Student.Email, cancellationToken);

            if (existingUser)
                throw new Exception("Email already exists");

            var password = "Student@123";

            var user = new User
            {
                Oid = Guid.NewGuid(),
                FullName = request.Student.FullName,
                Email = request.Student.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                PhoneNumber = request.Student.Phone,
                Role = UserRole.Student,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            await _userRepo.AddAsync(user);

            var student = _mapper.Map<Student>(request.Student);

            student.Oid = Guid.NewGuid();
            student.UserId = user.Oid;
            student.CreatedAt = DateTime.UtcNow;

            await _studentRepo.AddAsync(student);
            await _emailService.SendEmailAsync(
            user.Email,
            "Welcome to EduSmart - Your Account Details",
            $@"
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #4A90E2;'>Welcome to EduSmart! 🎓</h2>
                <p>Hello <strong>{user.FullName}</strong>,</p>
                <p>Your student account has been created successfully. Here are your login details:</p>
                <div style='background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                    <p><strong>Email:</strong> {user.Email}</p>
                    <p><strong>Password:</strong> {password}</p>
                </div>
                <p style='color: #e74c3c;'>Please change your password after your first login.</p>
                <p>Best regards,<br/>EduSmart Team</p>
            </div>"
        );
            return student.Oid;
        }
    }
}