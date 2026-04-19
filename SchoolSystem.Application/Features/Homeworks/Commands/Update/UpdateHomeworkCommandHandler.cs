// Application/Features/Homeworks/Commands/Update/UpdateHomeworkCommandHandler.cs
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Homeworks.Commands.Update
{
    public class UpdateHomeworkCommandHandler : IRequestHandler<UpdateHomeworkCommand, bool>
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

        public async Task<bool> Handle(UpdateHomeworkCommand request, CancellationToken cancellationToken)
        {
            var homework = await _homeworkRepo
                .GetAllQueryable()
                .Include(h => h.Attachments)
                .FirstOrDefaultAsync(h => h.Oid == request.Id && !h.IsDeleted, cancellationToken);

            if (homework == null)
                throw new Exception("Homework not found");

            homework.Title = request.Dto.Title;
            homework.Description = request.Dto.Description;
            homework.Instructions = request.Dto.Instructions;
            homework.DueDate = request.Dto.DueDate;
            homework.TotalMarks = request.Dto.TotalMarks;
            homework.SubmissionType = request.Dto.SubmissionType;
            homework.AllowLateSubmissions = request.Dto.AllowLateSubmissions;
            homework.NotifyParents = request.Dto.NotifyParents;
            homework.ClassOid = request.Dto.ClassId;
            homework.SubjectOid = request.Dto.SubjectId;
            homework.UpdatedAt = DateTime.UtcNow;

            await _homeworkRepo.UpdateAsync(homework);

            foreach (var attachmentDto in request.Dto.Attachments)
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
                        attachment.FileUrl = attachmentDto.FileUrl;
                        attachment.FileType = attachmentDto.FileType;
                        attachment.FileSize = attachmentDto.FileSize;
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
                        FileUrl = attachmentDto.FileUrl,
                        FileType = attachmentDto.FileType,
                        FileSize = attachmentDto.FileSize,
                        HomeworkOid = homework.Oid,
                        CreatedAt = DateTime.UtcNow
                    };
                    await _attachmentRepo.AddAsync(newAttachment);
                }
            }

            return true;
        }
    }
}