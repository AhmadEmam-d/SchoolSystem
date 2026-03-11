using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Sections.DTOs.Read;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Sections.Queries.GetById
{
    public class GetSectionByIdQueryHandler : IRequestHandler<GetSectionByIdQuery, SectionDto>
    {
        private readonly IGenericRepository<Section> _repo;
        private readonly IMapper _mapper;

        public GetSectionByIdQueryHandler(IGenericRepository<Section> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<SectionDto> Handle(GetSectionByIdQuery request, CancellationToken cancellationToken)
        {
            // ✅ استخدم GetAllQueryable() مع Include بدلاً من GetByOidAsync
            var section = await _repo.GetAllQueryable()
                .Include(s => s.Class)           // تحميل الـ Class المرتبط
                .Include(s => s.Students)        // تحميل الطلاب (اختياري)
                .FirstOrDefaultAsync(s => s.Oid == request.Id, cancellationToken);

            if (section == null)
                return null;

            return _mapper.Map<SectionDto>(section);
        }
    }
}