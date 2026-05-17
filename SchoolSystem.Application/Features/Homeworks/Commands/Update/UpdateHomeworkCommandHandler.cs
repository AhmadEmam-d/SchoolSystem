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

            _mapper.Map(request.Dto, homework);
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
                        _mapper.Map(attachmentDto, attachment);

                        attachment.UpdatedAt = DateTime.UtcNow;

                        await _attachmentRepo.UpdateAsync(attachment);
                    }
                }
                else if (!string.IsNullOrEmpty(attachmentDto.FileName))
                {
                    var newAttachment = _mapper.Map<HomeworkAttachment>(attachmentDto);

                    newAttachment.Oid = Guid.NewGuid();
                    newAttachment.HomeworkOid = homework.Oid;
                    newAttachment.CreatedAt = DateTime.UtcNow;

                    await _attachmentRepo.AddAsync(newAttachment);
                }
            }

            return true;
        }
    }
}