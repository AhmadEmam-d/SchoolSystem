using AutoMapper;
using MediatR;
using SchoolSystem.Application.Features.Classes.DTOs.Read;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Classes.Queries.GetByOid
{
    public class GetClassByIdQueryHandler
        : IRequestHandler<GetClassByIdQuery, ClassResponseDto>
    {
        private readonly IGenericRepository<Class> _repo;
        private readonly IMapper _mapper;

        public GetClassByIdQueryHandler(IGenericRepository<Class> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<ClassResponseDto> Handle(GetClassByIdQuery request, CancellationToken cancellationToken)
        {
            var entity = await _repo.GetByOidAsync(request.Id);
            if (entity == null) throw new Exception("Class not found");

            return _mapper.Map<ClassResponseDto>(entity);
        }
    }

}
