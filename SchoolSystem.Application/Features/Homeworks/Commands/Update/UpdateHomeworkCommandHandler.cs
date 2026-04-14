using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Homeworks.DTOs.Response;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Homeworks.Commands.Update
{
    public class UpdateHomeworkCommandHandler : IRequestHandler<UpdateHomeworkCommand, HomeworkDetailResponseDto>
    {
        private readonly IGenericRepository<Homework> _homeworkRepo;
        private readonly IGenericRepository<HomeworkAttachment> _attachmentRepo;
        private readonly IMapper _mapper;

        public UpdateHomeworkCommandHandler(
            IGenericRepository<Homework> homeworkRepo,
            IGenericRepository<HomeworkAttachment> attachmentRepo,
            IMapper mapper)
        {
            _homeworkRepo = homeworkRepo;
            _attachmentRepo = attachmentRepo;
            _mapper = mapper;
        }

        public async Task<HomeworkDetailResponseDto> Handle(UpdateHomeworkCommand request, CancellationToken cancellationToken)
        {
            var homework = await _homeworkRepo
                .GetAllQueryable()
                .Include(h => h.Class)
                .ThenInclude(c => c.Students)
                .Include(h => h.Subject)
                .Include(h => h.Teacher)
                .ThenInclude(t => t.User)
                .Include(h => h.Submissions)
                .Include(h => h.Attachments)
                .FirstOrDefaultAsync(h => h.Oid == request.Oid && !h.IsDeleted, cancellationToken);

            if (homework == null)
                throw new Exception("Homework not found");

            // Update basic info
            _mapper.Map(request.Homework, homework);
            homework.UpdatedAt = DateTime.UtcNow;

            await _homeworkRepo.UpdateAsync(homework);

            // Update attachments
            foreach (var attachmentDto in request.Homework.Attachments)
            {
                if (attachmentDto.IsDeleted && attachmentDto.Oid.HasValue)
                {
                    var attachment = await _attachmentRepo.GetByOidAsync(attachmentDto.Oid.Value);
                    if (attachment != null)
                        await _attachmentRepo.DeleteAsync(attachment.Oid);
                }
                else if (attachmentDto.Oid.HasValue)
                {
                    var attachment = await _attachmentRepo.GetByOidAsync(attachmentDto.Oid.Value);
                    if (attachment != null)
                    {
                        attachment.FileName = attachmentDto.FileName;
                        attachment.FilePath = attachmentDto.FilePath;
                        attachment.FileType = attachmentDto.FileType;
                        attachment.UpdatedAt = DateTime.UtcNow;
                        await _attachmentRepo.UpdateAsync(attachment);
                    }
                }
                else if (!string.IsNullOrEmpty(attachmentDto.FileName))
                {
                    var newAttachment = new HomeworkAttachment
                    {
                        Oid = Guid.NewGuid(),
                        FileName = attachmentDto.FileName,
                        FilePath = attachmentDto.FilePath,
                        FileType = attachmentDto.FileType,
                        HomeworkOid = homework.Oid,
                        CreatedAt = DateTime.UtcNow
                    };
                    await _attachmentRepo.AddAsync(newAttachment);
                }
            }

            return _mapper.Map<HomeworkDetailResponseDto>(homework);
        }
    }
}