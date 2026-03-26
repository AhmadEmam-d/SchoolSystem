using AutoMapper;
using MediatR;
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
        private readonly IGenericRepository<Subject> _subjectRepo;
        private readonly IGenericRepository<Class> _classRepo;
        private readonly IMapper _mapper;

        public CreateExamCommandHandler(
            IGenericRepository<Exam> examRepo,
            IGenericRepository<Subject> subjectRepo,
            IGenericRepository<Class> classRepo,
            IMapper mapper)
        {
            _examRepo = examRepo;
            _subjectRepo = subjectRepo;
            _classRepo = classRepo;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(CreateExamCommand request, CancellationToken cancellationToken)
        {
            var subject = await _subjectRepo.GetByOidAsync(request.Dto.SubjectOid);
            if (subject == null)
                throw new Exception("Subject not found");

            var classEntity = await _classRepo.GetByOidAsync(request.Dto.ClassOid);
            if (classEntity == null)
                throw new Exception("Class not found");

            var exam = new Exam
            {
                Name = request.Dto.Name,
                Description = request.Dto.Description,
                Type = (ExamType)Enum.Parse(typeof(ExamType), request.Dto.Type),
                SubjectOid = request.Dto.SubjectOid,
                ClassOid = request.Dto.ClassOid,
                Date = request.Dto.Date,
                StartTime = TimeSpan.Parse(request.Dto.StartTime),
                Duration = TimeSpan.Parse(request.Dto.Duration),
                MaxScore = request.Dto.MaxScore,
                PassingScore = request.Dto.PassingScore,
                Status = ExamStatus.Pending,
                Room = request.Dto.Room,
                Instructions = request.Dto.Instructions
            };

            await _examRepo.AddAsync(exam);
            return exam.Oid;
        }
    }
}