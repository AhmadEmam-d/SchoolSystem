using AutoMapper;
using MediatR;
using SchoolSystem.Application.Features.Exams.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Exams.Commands.Update
{
    public class UpdateExamCommandHandler : IRequestHandler<UpdateExamCommand, bool>
    {
        private readonly IGenericRepository<Exam> _examRepo;
        private readonly IMapper _mapper;

        public UpdateExamCommandHandler(IGenericRepository<Exam> examRepo, IMapper mapper)
        {
            _examRepo = examRepo;
            _mapper = mapper;
        }

        public async Task<bool> Handle(UpdateExamCommand request, CancellationToken cancellationToken)
        {
            var exam = await _examRepo.GetByOidAsync(request.Dto.Oid);
            if (exam == null)
                throw new Exception("Exam not found");

            if (!string.IsNullOrEmpty(request.Dto.Name))
                exam.Name = request.Dto.Name;

            if (!string.IsNullOrEmpty(request.Dto.Description))
                exam.Description = request.Dto.Description;

            if (!string.IsNullOrEmpty(request.Dto.Type))
                exam.Type = (ExamType)Enum.Parse(typeof(ExamType), request.Dto.Type);

            if (request.Dto.Date.HasValue)
                exam.Date = request.Dto.Date.Value;

            if (!string.IsNullOrEmpty(request.Dto.StartTime))
                exam.StartTime = TimeSpan.Parse(request.Dto.StartTime);

            if (!string.IsNullOrEmpty(request.Dto.Duration))
                exam.Duration = TimeSpan.Parse(request.Dto.Duration);

            if (request.Dto.MaxScore.HasValue)
                exam.MaxScore = request.Dto.MaxScore.Value;

            if (request.Dto.PassingScore.HasValue)
                exam.PassingScore = request.Dto.PassingScore.Value;

            if (!string.IsNullOrEmpty(request.Dto.Status))
                exam.Status = (ExamStatus)Enum.Parse(typeof(ExamStatus), request.Dto.Status);

            if (!string.IsNullOrEmpty(request.Dto.Room))
                exam.Room = request.Dto.Room;

            if (!string.IsNullOrEmpty(request.Dto.Instructions))
                exam.Instructions = request.Dto.Instructions;

            await _examRepo.UpdateAsync(exam);
            return true;
        }
    }
}