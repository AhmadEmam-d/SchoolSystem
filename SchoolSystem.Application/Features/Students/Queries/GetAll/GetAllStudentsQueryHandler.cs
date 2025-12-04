using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Students.DTOs.Read;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public class GetAllStudentsQueryHandler : IRequestHandler<GetAllStudentsQuery, List<StudentDto>>
{
    private readonly IGenericRepository<Student> _repository;
    private readonly IMapper _mapper;

    public GetAllStudentsQueryHandler(IGenericRepository<Student> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<List<StudentDto>> Handle(GetAllStudentsQuery request, CancellationToken cancellationToken)
    {
        var students = await _repository.GetAllQueryable()
            .Where(s => !s.IsDeleted)
            .ToListAsync(cancellationToken);

        return _mapper.Map<List<StudentDto>>(students);
    }
}
