// Application/Features/Lessons/Queries/GetStudentLessons/GetStudentLessonsQueryHandler.cs
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Lessons.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Lessons.Queries.GetStudentLessons
{
    public class GetStudentLessonsQueryHandler : IRequestHandler<GetStudentLessonsQuery, List<LessonResponseDto>>
    {
        private readonly IGenericRepository<Lesson> _lessonRepo;
        private readonly IMapper _mapper;

        public GetStudentLessonsQueryHandler(IGenericRepository<Lesson> lessonRepo, IMapper mapper)
        {
            _lessonRepo = lessonRepo;
            _mapper = mapper;
        }

        public async Task<List<LessonResponseDto>> Handle(GetStudentLessonsQuery request, CancellationToken cancellationToken)
        {
            var query = _lessonRepo
                .GetAllQueryable()
                .Include(l => l.Class)
                .Include(l => l.Subject)
                .Include(l => l.Teacher)
                .ThenInclude(t => t.User)
                .Include(l => l.Objectives)
                .Include(l => l.Materials)
                .Include(l => l.Homeworks)
                .Where(l => !l.IsDeleted && l.ClassOid == request.ClassOid);

            // Apply subject filter
            if (request.SubjectOid.HasValue)
                query = query.Where(l => l.SubjectOid == request.SubjectOid);

            // Apply date filters
            if (request.FromDate.HasValue)
                query = query.Where(l => l.Date >= request.FromDate.Value);

            if (request.ToDate.HasValue)
                query = query.Where(l => l.Date <= request.ToDate.Value);

            // Order by date and time
            var lessons = await query
                .OrderBy(l => l.Date)
                .ThenBy(l => l.StartTime)
                .ToListAsync(cancellationToken);

            return _mapper.Map<List<LessonResponseDto>>(lessons);
        }
    }
}