using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Students.DTOs.Read;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

public class GetStudentByIdQueryHandler : IRequestHandler<GetStudentByIdQuery, StudentDto>
{
    private readonly IGenericRepository<Student> _repository;
    private readonly IMapper _mapper;

    public GetStudentByIdQueryHandler(IGenericRepository<Student> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<StudentDto> Handle(GetStudentByIdQuery request, CancellationToken cancellationToken)
    {
        var student = await _repository
               .GetAllQueryable()
               .Include(s => s.Parent)  
               .FirstOrDefaultAsync(s => s.Oid == request.Id, cancellationToken);

        if (student == null)
            return null;

        return _mapper.Map<StudentDto>(student);
    }
}
