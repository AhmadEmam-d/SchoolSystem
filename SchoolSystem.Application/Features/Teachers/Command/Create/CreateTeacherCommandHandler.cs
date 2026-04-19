using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
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
        private readonly IMapper _mapper;

        public CreateTeacherCommandHandler(
            IGenericRepository<User> userRepo,
            IGenericRepository<Teacher> teacherRepo,
            IGenericRepository<TeacherSubject> teacherSubjectRepo,
            IMapper mapper)
        {
            _userRepo = userRepo;
            _teacherRepo = teacherRepo;
            _teacherSubjectRepo = teacherSubjectRepo;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(CreateTeacherCommand request, CancellationToken cancellationToken)
        {
            // التحقق من عدم وجود البريد
            var existingUser = await _userRepo.GetAllQueryable()
                .AnyAsync(u => u.Email == request.Teacher.Email, cancellationToken);

            if (existingUser)
                throw new Exception("Email already exists");

            // إنشاء User
            var user = new User
            {
                Oid = Guid.NewGuid(),
                FullName = request.Teacher.FullName,
                Email = request.Teacher.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Teacher@123"),
                PhoneNumber = request.Teacher.Phone,
                Role = UserRole.Teacher,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            await _userRepo.AddAsync(user);

            // إنشاء Teacher
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

            // ربط المواد
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

            return teacher.Oid;
        }
    }
}