using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Sections.Queries.GetById
{
    using AutoMapper;
    using MediatR;
    using SchoolSystem.Application.Features.Sections.DTOs.Read;
    using SchoolSystem.Domain.Entities;
    using SchoolSystem.Domain.Interfaces.Common;

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
            var section = await _repo.GetByOidAsync(request.Id);
            return _mapper.Map<SectionDto>(section);
        }
    }

}
