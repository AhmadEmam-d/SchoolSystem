using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Classes.DTOs.Read;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Classes.Queries.GetTeacherClasses
{
    public class GetTeacherClassesQueryHandler : IRequestHandler<GetTeacherClassesQuery, List<ClassResponseDto>>
    {
        private readonly IGenericRepository<Class> _classRepo;

        public GetTeacherClassesQueryHandler(IGenericRepository<Class> classRepo)
        {
            _classRepo = classRepo;
        }

        public async Task<List<ClassResponseDto>> Handle(GetTeacherClassesQuery request, CancellationToken cancellationToken)
        {
            return await _classRepo.GetAllQueryable()
                .Where(c => !c.IsDeleted)
                .Select(c => new ClassResponseDto
                {
                    Oid = c.Oid,
                    Name = c.Name,
                    Level = c.Level,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync(cancellationToken);
        }
    }
}