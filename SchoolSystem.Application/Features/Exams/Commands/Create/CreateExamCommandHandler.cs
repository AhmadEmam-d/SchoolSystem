using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Exams.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Exams.Commands.Create
{
    public class CreateExamCommandHandler : IRequestHandler<CreateExamCommand, Guid>
    {
        private readonly IGenericRepository<Exam> _examRepo;
        private readonly IGenericRepository<Teacher> _teacherRepo;
        private readonly IMapper _mapper;

        public CreateExamCommandHandler(
            IGenericRepository<Exam> examRepo,
            IGenericRepository<Teacher> teacherRepo,
            IMapper mapper)
        {
            _examRepo = examRepo;
            _teacherRepo = teacherRepo;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(CreateExamCommand request, CancellationToken cancellationToken)  // ✅ CancellationToken وليس Token
        {
            // الحصول على Teacher من UserId
            var teacher = await _teacherRepo
                .GetAllQueryable()
                .FirstOrDefaultAsync(t => t.UserId == request.TeacherId, cancellationToken);

            if (teacher == null)
                throw new Exception("Teacher not found");

            // استخدام AutoMapper لتحويل DTO إلى Entity
            var exam = _mapper.Map<Exam>(request.Dto);

            // تعيين القيم الإضافية
            exam.Oid = Guid.NewGuid();
            exam.TeacherOid = teacher.Oid;
            exam.Status = ExamStatus.Pending;
            exam.CreatedAt = DateTime.UtcNow;

            await _examRepo.AddAsync(exam);
            return exam.Oid;
        }
    }
}