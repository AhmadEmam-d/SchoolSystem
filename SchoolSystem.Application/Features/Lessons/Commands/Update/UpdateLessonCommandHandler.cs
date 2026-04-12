// Application/Features/Lessons/Commands/Update/UpdateLessonCommandHandler.cs
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Lessons.Commands.Update;
using SchoolSystem.Application.Features.Lessons.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Lessons.Commands.Update
{
    public class UpdateLessonCommandHandler : IRequestHandler<UpdateLessonCommand, LessonResponseDto>
    {
        private readonly IGenericRepository<Lesson> _lessonRepo;
        private readonly IGenericRepository<LessonObjective> _objectiveRepo;
        private readonly IGenericRepository<LessonMaterial> _materialRepo;
        private readonly IGenericRepository<LessonHomework> _homeworkRepo;
        private readonly IMapper _mapper;

        public UpdateLessonCommandHandler(
            IGenericRepository<Lesson> lessonRepo,
            IGenericRepository<LessonObjective> objectiveRepo,
            IGenericRepository<LessonMaterial> materialRepo,
            IGenericRepository<LessonHomework> homeworkRepo,
            IMapper mapper)
        {
            _lessonRepo = lessonRepo;
            _objectiveRepo = objectiveRepo;
            _materialRepo = materialRepo;
            _homeworkRepo = homeworkRepo;
            _mapper = mapper;
        }

        public async Task<LessonResponseDto> Handle(UpdateLessonCommand request, CancellationToken cancellationToken)
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

            // Update basic info
            _mapper.Map(request.Lesson, lesson);
            lesson.Duration = (int)(request.Lesson.EndTime - request.Lesson.StartTime).TotalMinutes;
            lesson.UpdatedAt = DateTime.UtcNow;

            await _lessonRepo.UpdateAsync(lesson);

            // Update objectives
            foreach (var objectiveDto in request.Lesson.Objectives)
            {
                if (objectiveDto.IsDeleted && objectiveDto.Oid.HasValue)
                {
                    var objective = await _objectiveRepo.GetByOidAsync(objectiveDto.Oid.Value);
                    if (objective != null)
                        await _objectiveRepo.DeleteAsync(objective.Oid);
                }
                else if (objectiveDto.Oid.HasValue)
                {
                    var objective = await _objectiveRepo.GetByOidAsync(objectiveDto.Oid.Value);
                    if (objective != null)
                    {
                        objective.Description = objectiveDto.Description;
                        objective.Order = objectiveDto.Order;
                        objective.UpdatedAt = DateTime.UtcNow;
                        await _objectiveRepo.UpdateAsync(objective);
                    }
                }
                else if (!string.IsNullOrEmpty(objectiveDto.Description))
                {
                    var newObjective = new LessonObjective
                    {
                        Oid = Guid.NewGuid(),
                        Description = objectiveDto.Description,
                        Order = objectiveDto.Order,
                        LessonOid = lesson.Oid,
                        CreatedAt = DateTime.UtcNow
                    };
                    await _objectiveRepo.AddAsync(newObjective);
                }
            }

            // Update materials
            foreach (var materialDto in request.Lesson.Materials)
            {
                if (materialDto.IsDeleted && materialDto.Oid.HasValue)
                {
                    var material = await _materialRepo.GetByOidAsync(materialDto.Oid.Value);
                    if (material != null)
                        await _materialRepo.DeleteAsync(material.Oid);
                }
                else if (materialDto.Oid.HasValue)
                {
                    var material = await _materialRepo.GetByOidAsync(materialDto.Oid.Value);
                    if (material != null)
                    {
                        material.Name = materialDto.Name;
                        material.FileUrl = materialDto.FileUrl;
                        material.FileType = materialDto.FileType;
                        material.FileSize = materialDto.FileSize;
                        material.UpdatedAt = DateTime.UtcNow;
                        await _materialRepo.UpdateAsync(material);
                    }
                }
                else if (!string.IsNullOrEmpty(materialDto.Name))
                {
                    var newMaterial = _mapper.Map<LessonMaterial>(materialDto);
                    newMaterial.Oid = Guid.NewGuid();
                    newMaterial.LessonOid = lesson.Oid;
                    newMaterial.CreatedAt = DateTime.UtcNow;
                    await _materialRepo.AddAsync(newMaterial);
                }
            }

            // Update homework
            if (request.Lesson.Homework != null)
            {
                if (request.Lesson.Homework.IsDeleted && request.Lesson.Homework.Oid.HasValue)
                {
                    var homework = await _homeworkRepo.GetByOidAsync(request.Lesson.Homework.Oid.Value);
                    if (homework != null)
                        await _homeworkRepo.DeleteAsync(homework.Oid);
                }
                else if (request.Lesson.Homework.Oid.HasValue)
                {
                    var homework = await _homeworkRepo.GetByOidAsync(request.Lesson.Homework.Oid.Value);
                    if (homework != null)
                    {
                        homework.Title = request.Lesson.Homework.Title;
                        homework.Description = request.Lesson.Homework.Description;
                        homework.DueDate = request.Lesson.Homework.DueDate;
                        homework.UpdatedAt = DateTime.UtcNow;
                        await _homeworkRepo.UpdateAsync(homework);
                    }
                }
                else if (!string.IsNullOrEmpty(request.Lesson.Homework.Title))
                {
                    var newHomework = _mapper.Map<LessonHomework>(request.Lesson.Homework);
                    newHomework.Oid = Guid.NewGuid();
                    newHomework.LessonOid = lesson.Oid;
                    newHomework.CreatedAt = DateTime.UtcNow;
                    await _homeworkRepo.AddAsync(newHomework);
                }
            }

            return _mapper.Map<LessonResponseDto>(lesson);
        }
    }
}