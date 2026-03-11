using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using SchoolSystem.Application.Features.Teachers.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using Microsoft.EntityFrameworkCore;

namespace SchoolSystem.Application.Features.Teachers.Query.GetAll
{
    public class GetAllTeachersQueryHandler
        : IRequestHandler<GetAllTeachersQuery, List<TeacherResponseDto>>
    {
        private readonly IGenericRepository<Teacher> _teacherRepo;
        private readonly IMapper _mapper;

        public GetAllTeachersQueryHandler(
            IGenericRepository<Teacher> teacherRepo,
            IMapper mapper)
        {
            _teacherRepo = teacherRepo;
            _mapper = mapper;
        }

        public async Task<List<TeacherResponseDto>> Handle(GetAllTeachersQuery request, CancellationToken cancellationToken)
        {
            return await _teacherRepo
                .GetAllQueryable()
                .ProjectTo<TeacherResponseDto>(_mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        }
    }
}
