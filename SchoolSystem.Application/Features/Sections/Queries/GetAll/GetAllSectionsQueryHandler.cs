using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Sections.DTOs.Read;
using SchoolSystem.Application.Features.Sections.Queries.GetAll;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class GetAllSectionsQueryHandler : IRequestHandler<GetAllSectionsQuery, IEnumerable<SectionDto>>
{
    private readonly IGenericRepository<Section> _repo;
    private readonly IMapper _mapper;

    public GetAllSectionsQueryHandler(IGenericRepository<Section> repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<SectionDto>> Handle(GetAllSectionsQuery request, CancellationToken cancellationToken)
    {
        // ✅ استخدم GetAllQueryable() بدلاً من GetAllAsync() وأضف Include
        var sections = await _repo.GetAllQueryable()
            .Include(s => s.Class)           // هذا السطر يحمل الـ Class المرتبط
            .Include(s => s.Students)        // اختياري: إذا أردت تحميل الطلاب أيضاً
            .ToListAsync(cancellationToken);

        return _mapper.Map<IEnumerable<SectionDto>>(sections);
    }
}