using AutoMapper;
using MediatR;
using SchoolSystem.Application.Features.Teachers.Command.Update;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

public class UpdateTeacherCommandHandler : IRequestHandler<UpdateTeacherCommand>
{
    private readonly IGenericRepository<Teacher> _teacherRepo;
    private readonly IGenericRepository<Subject> _subjectRepo;
    private readonly IMapper _mapper;

    public UpdateTeacherCommandHandler(
        IGenericRepository<Teacher> teacherRepo,
        IGenericRepository<Subject> subjectRepo,
        IMapper mapper)
    {
        _teacherRepo = teacherRepo;
        _subjectRepo = subjectRepo;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(UpdateTeacherCommand request, CancellationToken cancellationToken)
    {
        var teacher = await _teacherRepo.GetByOidAsync(request.Id);
        if (teacher == null)
            throw new Exception("Teacher not found");

        _mapper.Map(request.Teacher, teacher);
        teacher.UpdatedAt = DateTime.UtcNow;

        // Update subjects
        teacher.Subjects.Clear();

        if (request.Teacher.SubjectOids.Any())
        {
            var subjects = await _subjectRepo.GetAllAsync();
            teacher.Subjects = subjects
                .Where(s => request.Teacher.SubjectOids.Contains(s.Oid))
                .ToList();
        }

        await _teacherRepo.UpdateAsync(teacher);

        return Unit.Value;
    }
}
