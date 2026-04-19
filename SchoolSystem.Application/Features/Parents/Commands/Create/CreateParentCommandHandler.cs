using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
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
        private readonly IMapper _mapper;

        public CreateParentCommandHandler(
            IGenericRepository<User> userRepo,
            IGenericRepository<Parent> parentRepo,
            IMapper mapper)
        {
            _userRepo = userRepo;
            _parentRepo = parentRepo;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(CreateParentCommand request, CancellationToken cancellationToken)
        {
            if (request.Parent == null)
                throw new Exception("Parent data is required");

            if (string.IsNullOrEmpty(request.Parent.Email))
                throw new Exception("Email is required");

            // التحقق من عدم وجود البريد
            var existingUser = await _userRepo.GetAllQueryable()
                .AnyAsync(u => u.Email == request.Parent.Email, cancellationToken);

            if (existingUser)
                throw new Exception("Email already exists");

            // إنشاء User لولي الأمر
            var user = new User
            {
                Oid = Guid.NewGuid(),
                FullName = request.Parent.FatherName,
                Email = request.Parent.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Parent@123"),
                PhoneNumber = request.Parent.Phone,
                Role = UserRole.Parent,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            await _userRepo.AddAsync(user);

            // إنشاء Parent
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

            return parent.Oid;
        }
    }
}