// Application/Features/Lessons/Queries/GetById/GetLessonByIdQueryHandler.cs
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Lessons.DTOs;
using SchoolSystem.Application.Features.Lessons.Queries.GetById;
using SchoolSystem.Application.Features.Lessons.Queries.GetByOid;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Lessons.Queries.GetById
{
    public class GetLessonByIdQueryHandler : IRequestHandler<GetLessonByIdQuery, LessonResponseDto>
    {
        private readonly IGenericRepository<Lesson> _lessonRepo;
        private readonly IMapper _mapper;

        public GetLessonByIdQueryHandler(IGenericRepository<Lesson> lessonRepo, IMapper mapper)
        {
            _lessonRepo = lessonRepo;
            _mapper = mapper;
        }

        public async Task<LessonResponseDto> Handle(GetLessonByIdQuery request, CancellationToken cancellationToken)
        {
            var lesson = await _lessonRepo
                .GetAllQueryable()
                .Include(l => l.Class)
                .Include(l => l.Subject)
                .Include(l => l.Teacher)
                .Include(l => l.Teacher.User)
                .Include(l => l.Objectives)
                .Include(l => l.Materials)
                .Include(l => l.Homeworks)
                .FirstOrDefaultAsync(l => l.Oid == request.Oid && !l.IsDeleted, cancellationToken);

            if (lesson == null)
                throw new Exception("Lesson not found");

            return _mapper.Map<LessonResponseDto>(lesson);
        }
    }
}