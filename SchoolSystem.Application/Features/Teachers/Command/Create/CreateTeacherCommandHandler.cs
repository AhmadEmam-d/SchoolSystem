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

namespace SchoolSystem.Application.Features.Teachers.Commands.Create
{
    public class CreateTeacherCommandHandler : IRequestHandler<CreateTeacherCommand, Guid>
    {
        private readonly IGenericRepository<User> _userRepo;
        private readonly IGenericRepository<Teacher> _teacherRepo;
        private readonly IGenericRepository<TeacherSubject> _teacherSubjectRepo;
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;

        public CreateTeacherCommandHandler(
            IGenericRepository<User> userRepo,
            IGenericRepository<Teacher> teacherRepo,
            IGenericRepository<TeacherSubject> teacherSubjectRepo,
                IEmailService emailService,
            IMapper mapper)
        {
            _userRepo = userRepo;
            _teacherRepo = teacherRepo;
            _teacherSubjectRepo = teacherSubjectRepo;
            _emailService = emailService;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(CreateTeacherCommand request, CancellationToken cancellationToken)
        {
            var existingUser = await _userRepo.GetAllQueryable()
                .AnyAsync(u => u.Email == request.Teacher.Email && !u.IsDeleted, cancellationToken);

            if (existingUser)
                throw new Exception("Email already exists");
            var password = "Teacher@123";

            var user = new User
            {
                Oid = Guid.NewGuid(),
                FullName = request.Teacher.FullName,
                Email = request.Teacher.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                PhoneNumber = request.Teacher.Phone,
                Role = UserRole.Teacher,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            await _userRepo.AddAsync(user);

            var teacher = new Teacher
            {
                Oid = Guid.NewGuid(),
                FullName = request.Teacher.FullName,
                Email = request.Teacher.Email,
                Phone = request.Teacher.Phone,
                UserId = user.Oid,
                CreatedAt = DateTime.UtcNow
            };
            await _teacherRepo.AddAsync(teacher);

            foreach (var subjectId in request.Teacher.SubjectOids)
            {
                var teacherSubject = new TeacherSubject
                {
                    Oid = Guid.NewGuid(),
                    TeacherOid = teacher.Oid,
                    SubjectOid = subjectId,
                    CreatedAt = DateTime.UtcNow
                };
                await _teacherSubjectRepo.AddAsync(teacherSubject);
            }
            await _emailService.SendEmailAsync(
               user.Email,
               "Welcome to EduSmart - Your Account Details",
               $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                    <h2 style='color: #4A90E2;'>Welcome to EduSmart! 🎓</h2>
                    <p>Hello <strong>{user.FullName}</strong>,</p>
                    <p>Your teacher account has been created successfully. Here are your login details:</p>
                    <div style='background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;'>
                        <p><strong>Email:</strong> {user.Email}</p>
                        <p><strong>Password:</strong> {password}</p>
                    </div>
                    <p style='color: #e74c3c;'>Please change your password after your first login.</p>
                    <p>Best regards,<br/>EduSmart Team</p>
                </div>"
            );
            return teacher.Oid;
        }
    }
}