using AutoMapper;
using MediatR;
using SchoolSystem.Application.Features.Teachers.DTOs;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;

namespace SchoolSystem.Application.Features.Teachers.Query.GetById
{
    public class GetTeacherByIdQueryHandler
        : IRequestHandler<GetTeacherByIdQuery, TeacherResponseDto>
    {
        private readonly IGenericRepository<Teacher> _teacherRepo;
        private readonly IMapper _mapper;

        public GetTeacherByIdQueryHandler(
            IGenericRepository<Teacher> teacherRepo,
            IMapper mapper)
        {
            _teacherRepo = teacherRepo;
            _mapper = mapper;
        }

        public async Task<TeacherResponseDto> Handle(GetTeacherByIdQuery request, CancellationToken cancellationToken)
        {
            var teacher = await _teacherRepo.GetByOidAsync(request.Oid/*, includeProperties: "Subjects"*/);

            if (teacher == null)
                return null;

            return _mapper.Map<TeacherResponseDto>(teacher);
        }
    }
}

