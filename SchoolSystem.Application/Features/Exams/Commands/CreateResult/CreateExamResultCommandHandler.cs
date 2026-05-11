using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Exams.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Exams.Commands.CreateResult
{
    public class CreateExamResultCommandHandler : IRequestHandler<CreateExamResultCommand, Guid>
    {
        private readonly IGenericRepository<ExamResult> _examResultRepo;
        private readonly IGenericRepository<ExamSubmission> _submissionRepo;
        private readonly IGenericRepository<Exam> _examRepo;
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IMapper _mapper;

        public CreateExamResultCommandHandler(
            IGenericRepository<ExamResult> examResultRepo,
            IGenericRepository<ExamSubmission> submissionRepo,
            IGenericRepository<Exam> examRepo,
            IGenericRepository<Student> studentRepo,
            IMapper mapper)
        {
            _examResultRepo = examResultRepo;
            _submissionRepo = submissionRepo;
            _examRepo = examRepo;
            _studentRepo = studentRepo;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(CreateExamResultCommand request, CancellationToken cancellationToken)
        {
            var exam = await _examRepo.GetByOidAsync(request.Dto.ExamOid);
            if (exam == null)
                throw new Exception("Exam not found");

            var student = await _studentRepo.GetByOidAsync(request.Dto.StudentOid);
            if (student == null)
                throw new Exception("Student not found");

            var percentage = (int)((double)request.Dto.Score / exam.MaxScore * 100);
            var isPassed = percentage >= exam.PassingScore;
            var grade = GetGrade(percentage);

            var result = new ExamResult
            {
                ExamOid = request.Dto.ExamOid,
                StudentOid = request.Dto.StudentOid,
                Score = request.Dto.Score,
                Percentage = percentage,
                Grade = grade,
                Remarks = request.Dto.Remarks,
                IsPassed = isPassed,
                SubmittedAt = DateTime.UtcNow,
                GradedAt = DateTime.UtcNow,
            };

            await _examResultRepo.AddAsync(result);

            // UPDATE the submission so isGraded/score/status reflect correctly
            var submission = await _submissionRepo
                .GetAllQueryable()
                .Cast<ExamSubmission>()
                .Where(s => s.ExamOid == request.Dto.ExamOid
                         && s.StudentOid == request.Dto.StudentOid
                         && !s.IsDeleted)
                .FirstOrDefaultAsync(cancellationToken);

            if (submission != null)
            {
                submission.Score = request.Dto.Score;
                submission.Feedback = request.Dto.Remarks;
                submission.GradedAt = DateTime.UtcNow;
                submission.Status = ExamSubmissionStatus.Graded;  // enum, not string
                await _submissionRepo.UpdateAsync(submission);
            }

            // Update exam status to Grading if not yet Completed
            if (exam.Status != ExamStatus.Completed)
            {
                exam.Status = ExamStatus.Grading;
                await _examRepo.UpdateAsync(exam);
            }

            return result.Oid;
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