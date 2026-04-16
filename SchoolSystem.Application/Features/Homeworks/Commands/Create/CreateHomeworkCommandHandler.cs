using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Enums;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Homeworks.Commands.Create
{
    public class CreateHomeworkCommandHandler : IRequestHandler<CreateHomeworkCommand, Guid>
    {
        private readonly IGenericRepository<Homework> _homeworkRepo;
        private readonly IGenericRepository<HomeworkAttachment> _attachmentRepo;
        private readonly IGenericRepository<Teacher> _teacherRepo;  // ✅ أضف هذا
        private readonly IMapper _mapper;

        public CreateHomeworkCommandHandler(
            IGenericRepository<Homework> homeworkRepo,
            IGenericRepository<HomeworkAttachment> attachmentRepo,
            IGenericRepository<Teacher> teacherRepo,  // ✅ أضف هذا
            IMapper mapper)
        {
            _homeworkRepo = homeworkRepo;
            _attachmentRepo = attachmentRepo;
            _teacherRepo = teacherRepo;
            _mapper = mapper;
        }

        public async Task<Guid> Handle(CreateHomeworkCommand request, CancellationToken cancellationToken)
        {
            // ✅ الحصول على Teacher من UserId
            var teacher = await _teacherRepo
                .GetAllQueryable()
                .FirstOrDefaultAsync(t => t.UserId == request.TeacherId, cancellationToken);

            if (teacher == null)
                throw new Exception("Teacher not found for this user");

            var homework = _mapper.Map<Homework>(request.Dto);
            homework.Oid = Guid.NewGuid();
            homework.TeacherOid = teacher.Oid;  // ✅ استخدم TeacherOid من جدول Teachers
            homework.AssignedDate = DateTime.UtcNow;
            homework.Status = HomeworkStatus.Active;
            homework.CreatedAt = DateTime.UtcNow;

            await _homeworkRepo.AddAsync(homework);

            foreach (var attachment in request.Dto.Attachments)
            {
                var homeworkAttachment = new HomeworkAttachment
                {
                    Oid = Guid.NewGuid(),
                    FileName = attachment.FileName,
                    FileUrl = attachment.FileUrl,
                    FileType = attachment.FileType,
                    FileSize = attachment.FileSize,
                    HomeworkOid = homework.Oid,
                    CreatedAt = DateTime.UtcNow
                };
                await _attachmentRepo.AddAsync(homeworkAttachment);
            }

            return homework.Oid;
        }
    }
}