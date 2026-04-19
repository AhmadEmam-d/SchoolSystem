using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Students.DTOs;
using SchoolSystem.Application.Features.Students.DTOs.Read;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Students.Queries.GetAllStudentsWithSubjectsCount
{
    public class GetAllStudentsWithSubjectsCountQueryHandler : IRequestHandler<GetAllStudentsWithSubjectsCountQuery, List<StudentSubjectsCountDto>>
    {
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<Domain.Entities.Timetable> _timetableRepo;
        private readonly IMapper _mapper;

        public GetAllStudentsWithSubjectsCountQueryHandler(
            IGenericRepository<Student> studentRepo,
            IGenericRepository<Domain.Entities.Timetable> timetableRepo,
            IMapper mapper)
        {
            _studentRepo = studentRepo;
            _timetableRepo = timetableRepo;
            _mapper = mapper;
        }

        public async Task<List<StudentSubjectsCountDto>> Handle(GetAllStudentsWithSubjectsCountQuery request, CancellationToken cancellationToken)
        {
            // Get all students
            var studentsQuery = _studentRepo.GetAllQueryable();

            if (request.ClassId.HasValue)
                studentsQuery = studentsQuery.Where(s => s.ClassOid == request.ClassId.Value);

            var students = await studentsQuery.ToListAsync(cancellationToken);

            var result = new List<StudentSubjectsCountDto>();

            foreach (var student in students)
            {
                // Get class name separately if needed
                var classEntity = await _studentRepo.GetAllQueryable()
                    .Where(s => s.Oid == student.Oid)
                    .Select(s => s.Class)
                    .FirstOrDefaultAsync(cancellationToken);

                // Get distinct subjects for this student's class from Timetable
                var subjects = await _timetableRepo
                    .GetAllQueryable()
                    .Where(t => t.ClassOid == student.ClassOid)
                    .Select(t => t.Subject)
                    .Where(s => s != null)
                    .Distinct()
                    .ToListAsync(cancellationToken);

                result.Add(new StudentSubjectsCountDto
                {
                    StudentId = student.Oid,
                    StudentName = student.FullName,
                    ClassName = classEntity?.Name ?? "N/A",
                    SubjectsCount = subjects.Count,
                    SubjectsNames = subjects.Select(s => s.Name).ToList()
                });
            }

            return result;
        }
    }
}