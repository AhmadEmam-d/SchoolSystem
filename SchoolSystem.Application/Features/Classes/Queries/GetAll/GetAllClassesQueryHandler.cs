using AutoMapper;
using MediatR;
using SchoolSystem.Application.Features.Classes.DTOs.Read;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Classes.Queries.GetAll
{
    public class GetAllClassesQueryHandler
        : IRequestHandler<GetAllClassesQuery, IEnumerable<ClassResponseDto>>
    {
        private readonly IGenericRepository<Class> _repo;
        private readonly IMapper _mapper;

        public GetAllClassesQueryHandler(IGenericRepository<Class> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ClassResponseDto>> Handle(GetAllClassesQuery request, CancellationToken cancellationToken)
        {
            var result = await _repo.GetAllAsync();
            return _mapper.Map<IEnumerable<ClassResponseDto>>(result);
        }
    }

}
