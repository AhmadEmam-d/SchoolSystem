using AutoMapper;
using MediatR;
using SchoolSystem.Application.Features.Teachers.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

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
            var teachers = await _teacherRepo.GetAllAsync(/*includeProperties: "Subjects"*/);

            return _mapper.Map<List<TeacherResponseDto>>(teachers);
        }
    }
}
