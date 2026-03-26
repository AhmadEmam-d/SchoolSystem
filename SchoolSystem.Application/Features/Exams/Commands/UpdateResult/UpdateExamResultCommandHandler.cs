using AutoMapper;
using MediatR;
using SchoolSystem.Application.Features.Exams.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Exams.Commands.UpdateResult
{
    public class UpdateExamResultCommandHandler : IRequestHandler<UpdateExamResultCommand, bool>
    {
        private readonly IGenericRepository<ExamResult> _examResultRepo;
        private readonly IGenericRepository<Exam> _examRepo;
        private readonly IMapper _mapper;

        public UpdateExamResultCommandHandler(
            IGenericRepository<ExamResult> examResultRepo,
            IGenericRepository<Exam> examRepo,
            IMapper mapper)
        {
            _examResultRepo = examResultRepo;
            _examRepo = examRepo;
            _mapper = mapper;
        }

        public async Task<bool> Handle(UpdateExamResultCommand request, CancellationToken cancellationToken)
        {
            var result = await _examResultRepo.GetByOidAsync(request.Dto.Oid);
            if (result == null)
                throw new Exception("Exam result not found");

            var exam = await _examRepo.GetByOidAsync(result.ExamOid);
            if (exam == null)
                throw new Exception("Exam not found");

            result.Score = request.Dto.Score;
            result.Percentage = (int)((double)request.Dto.Score / exam.MaxScore * 100);
            result.IsPassed = result.Percentage >= exam.PassingScore;
            result.Grade = GetGrade(result.Percentage.Value);
            result.Remarks = request.Dto.Remarks;
            result.GradedAt = DateTime.UtcNow;

            await _examResultRepo.UpdateAsync(result);
            return true;
        }

        private string GetGrade(int percentage)
        {
            if (percentage >= 90) return "A";
            if (percentage >= 80) return "B";
            if (percentage >= 70) return "C";
            if (percentage >= 60) return "D";
            return "F";
        }
    }
}