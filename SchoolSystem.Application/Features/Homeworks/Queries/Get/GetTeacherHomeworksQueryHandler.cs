using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Homeworks.DTOs.Get;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
namespace SchoolSystem.Application.Features.Homeworks.Queries.Get;

public class GetTeacherHomeworksQueryHandler : IRequestHandler<GetTeacherHomeworksQuery, List<HomeworkListDto>>
{
    private readonly IGenericRepository<Homework> _homeworkRepo;
    private readonly IMapper _mapper;

    public GetTeacherHomeworksQueryHandler(
        IGenericRepository<Homework> homeworkRepo,
        IMapper mapper)
    {
        _homeworkRepo = homeworkRepo;
        _mapper = mapper;
    }

    public async Task<List<HomeworkListDto>> Handle(
    GetTeacherHomeworksQuery request,
    CancellationToken cancellationToken)
    {
        var homeworks = await _homeworkRepo
        .GetAllQueryable()
        .Where(h => h.TeacherOid == request.TeacherId)
        .Include(h => h.Class)
        .ThenInclude(c => c.Students) 
        .Include(h => h.Subject)          
        .Include(h => h.Submissions)
        .Include(h => h.Attachments)
        .ToListAsync();

        var result = _mapper.Map<List<HomeworkListDto>>(homeworks);

        for (int i = 0; i < homeworks.Count; i++)
        {
            result[i].TotalStudents = homeworks[i].Class.Students?.Count ?? 0;
        }

        return result;
    }
}