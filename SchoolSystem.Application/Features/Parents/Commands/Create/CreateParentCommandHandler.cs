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

namespace SchoolSystem.Application.Features.Parents.Commands.Create
{
    public class CreateParentCommandHandler : IRequestHandler<CreateParentCommand, Guid>
    {
        private readonly IGenericRepository<User> _userRepo;
        private readonly IGenericRepository<Parent> _parentRepo;
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;

        public CreateParentCommandHandler(
            IGenericRepository<User> userRepo,
            IGenericRepository<Parent> parentRepo,
            IEmailService emailService,
            IMapper mapper)
        {
            _userRepo = userRepo;
            _parentRepo = parentRepo;
            _emailService = emailService;   
            _mapper = mapper;
        }

        public async Task<Guid> Handle(CreateParentCommand request, CancellationToken cancellationToken)
        {
            if (request.Parent == null)
                throw new Exception("Parent data is required");

            if (string.IsNullOrEmpty(request.Parent.Email))
                throw new Exception("Email is required");

            var existingUser = await _userRepo.GetAllQueryable()
                .AnyAsync(u => u.Email == request.Parent.Email && !u.IsDeleted, cancellationToken);

            if (existingUser)
                throw new Exception("Email already exists");
            var password = "Parent@123";
            var user = new User
            {
                Oid = Guid.NewGuid(),
                FullName = request.Parent.FatherName,
                Email = request.Parent.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                PhoneNumber = request.Parent.Phone,
                Role = UserRole.Parent,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            await _userRepo.AddAsync(user);

            var parent = new Parent
            {
                Oid = Guid.NewGuid(),
                FatherName = request.Parent.FatherName,
                MotherName = request.Parent.MotherName ?? "",
                Phone = request.Parent.Phone,
                Email = request.Parent.Email,
                UserId = user.Oid,
                CreatedAt = DateTime.UtcNow
            };
            await _parentRepo.AddAsync(parent);
            await _emailService.SendEmailAsync(
            user.Email,
            "Welcome to EduSmart - Your Account Details",
            $@"
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #4A90E2;'>Welcome to EduSmart! 🎓</h2>
                <p>Hello <strong>{user.FullName}</strong>,</p>
                <p>Your parent account has been created successfully. Here are your login details:</p>
                <div style='background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                    <p><strong>Email:</strong> {user.Email}</p>
                    <p><strong>Password:</strong> {password}</p>
                </div>
                <p style='color: #e74c3c;'>Please change your password after your first login.</p>
                <p>Best regards,<br/>EduSmart Team</p>
            </div>"
              );
            return parent.Oid;
        }
    }
}