using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
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
        private readonly IMapper _mapper;

        public CreateStudentCommandHandler(
            IGenericRepository<User> userRepo,
            IGenericRepository<Student> studentRepo,
            IMapper mapper)
        {
            _userRepo = userRepo;
            _studentRepo = studentRepo;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(CreateStudentCommand request, CancellationToken cancellationToken)
        {
            // التحقق من عدم وجود البريد
            var existingUser = await _userRepo.GetAllQueryable()
                .AnyAsync(u => u.Email == request.Student.Email, cancellationToken);

            if (existingUser)
                throw new Exception("Email already exists");

            // إنشاء User للطالب
            var user = new User
            {
                Oid = Guid.NewGuid(),
                FullName = request.Student.FullName,
                Email = request.Student.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                PhoneNumber = request.Student.Phone,
                Role = UserRole.Student,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            await _userRepo.AddAsync(user);

            // ✅ استخدام AutoMapper لتحويل DTO إلى Student
            var student = _mapper.Map<Student>(request.Student);

            // تعيين القيم الإضافية التي لا يمكن تعيينها تلقائياً
            student.Oid = Guid.NewGuid();
            student.UserId = user.Oid;
            student.CreatedAt = DateTime.UtcNow;

            await _studentRepo.AddAsync(student);

            return student.Oid;
        }
    }
}