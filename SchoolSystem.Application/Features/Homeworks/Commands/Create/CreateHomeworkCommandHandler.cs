using AutoMapper;
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Homeworks.Commands.Create;

public class CreateHomeworkCommandHandler : IRequestHandler<CreateHomeworkCommand, bool>
{
    private readonly IGenericRepository<Homework> _homeworkRepo;
    private readonly IMapper _mapper;

    public CreateHomeworkCommandHandler(
        IGenericRepository<Homework> homeworkRepo,
        IMapper mapper)
    {
        _homeworkRepo = homeworkRepo;
        _mapper = mapper;
    }

    public async Task<bool> Handle(CreateHomeworkCommand request, CancellationToken cancellationToken)
    {
        var homework = _mapper.Map<Homework>(request.HomeworkDto);

        // TeacherId بيجي من Command مش من DTO
        homework.TeacherOid = request.TeacherId;

        await _homeworkRepo.AddAsync(homework);
        return true;
    }
}