// Application/Features/Lessons/Commands/Create/CreateLessonCommandHandler.cs
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Lessons.Commands.Create;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Lessons.Commands.Create
{
    public class CreateLessonCommandHandler : IRequestHandler<CreateLessonCommand, Guid>
    {
        private readonly IGenericRepository<Lesson> _lessonRepo;
        private readonly IGenericRepository<Teacher> _teacherRepo;  // ✅ أضف هذا
        private readonly IGenericRepository<LessonObjective> _objectiveRepo;
        private readonly IGenericRepository<LessonMaterial> _materialRepo;
        private readonly IGenericRepository<LessonHomework> _homeworkRepo;
        private readonly IMapper _mapper;

        public CreateLessonCommandHandler(
            IGenericRepository<Lesson> lessonRepo,
            IGenericRepository<Teacher> teacherRepo,  // ✅ أضف هذا
            IGenericRepository<LessonObjective> objectiveRepo,
            IGenericRepository<LessonMaterial> materialRepo,
            IGenericRepository<LessonHomework> homeworkRepo,
            IMapper mapper)
        {
            _lessonRepo = lessonRepo;
            _teacherRepo = teacherRepo;
            _objectiveRepo = objectiveRepo;
            _materialRepo = materialRepo;
            _homeworkRepo = homeworkRepo;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(CreateLessonCommand request, CancellationToken cancellationToken)
        {
            // ✅ الحصول على Teacher من UserId
            var teacher = await _teacherRepo
                .GetAllQueryable()
                .FirstOrDefaultAsync(t => t.UserId == request.TeacherId, cancellationToken);

            if (teacher == null)
                throw new Exception("Teacher not found for this user");

            // Map DTO to Entity
            var lesson = _mapper.Map<Lesson>(request.Lesson);
            lesson.Oid = Guid.NewGuid();
            lesson.TeacherOid = teacher.Oid;  // ✅ استخدام TeacherOid من جدول Teachers
            lesson.Duration = (int)(request.Lesson.EndTime - request.Lesson.StartTime).TotalMinutes;
            lesson.Status = request.Lesson.Date > DateTime.Now ? LessonStatus.Upcoming : LessonStatus.Completed;
            lesson.CreatedAt = DateTime.UtcNow;

            await _lessonRepo.AddAsync(lesson);

            // Add objectives
            for (int i = 0; i < request.Lesson.Objectives.Count; i++)
            {
                var objective = new LessonObjective
                {
                    Oid = Guid.NewGuid(),
                    Description = request.Lesson.Objectives[i],
                    Order = i + 1,
                    LessonOid = lesson.Oid,
                    CreatedAt = DateTime.UtcNow
                };
                await _objectiveRepo.AddAsync(objective);
            }

            // Add materials
            foreach (var materialDto in request.Lesson.Materials)
            {
                var material = _mapper.Map<LessonMaterial>(materialDto);
                material.Oid = Guid.NewGuid();
                material.LessonOid = lesson.Oid;
                material.CreatedAt = DateTime.UtcNow;
                await _materialRepo.AddAsync(material);
            }

            // Add homework if exists
            if (request.Lesson.Homework != null)
            {
                var homework = _mapper.Map<LessonHomework>(request.Lesson.Homework);
                homework.Oid = Guid.NewGuid();
                homework.LessonOid = lesson.Oid;
                homework.CreatedAt = DateTime.UtcNow;
                await _homeworkRepo.AddAsync(homework);
            }

            return lesson.Oid;
        }
    }
}