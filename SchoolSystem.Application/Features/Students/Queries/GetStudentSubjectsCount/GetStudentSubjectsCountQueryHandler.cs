using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SchoolSystem.Application.Features.Students.DTOs;
using SchoolSystem.Application.Features.Students.DTOs.Read;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Students.Queries.GetStudentSubjectsCount
{
    public class GetStudentSubjectsCountQueryHandler : IRequestHandler<GetStudentSubjectsCountQuery, List<StudentSubjectsCountDto>>
    {
        private readonly IGenericRepository<Student> _studentRepo;
        private readonly IGenericRepository<Domain.Entities.Timetable> _timetableRepo;
        private readonly IMapper _mapper;

        public GetStudentSubjectsCountQueryHandler(
            IGenericRepository<Student> studentRepo,
            IGenericRepository<Domain.Entities.Timetable> timetableRepo,
            IMapper mapper)
        {
            _studentRepo = studentRepo;
            _timetableRepo = timetableRepo;
            _mapper = mapper;
        }

        public async Task<List<StudentSubjectsCountDto>> Handle(GetStudentSubjectsCountQuery request, CancellationToken cancellationToken)
        {
            // Get all students first (without Include to avoid casting issues)
            var students = await _studentRepo.GetAllQueryable().ToListAsync(cancellationToken);

            if (request.StudentId.HasValue)
                students = students.Where(s => s.Oid == request.StudentId.Value).ToList();

            if (request.ClassId.HasValue)
                students = students.Where(s => s.ClassOid == request.ClassId.Value).ToList();

            var result = new List<StudentSubjectsCountDto>();

            foreach (var student in students)
            {
                // Get class name
                var className = student.Class?.Name ?? "N/A";

                // Get distinct subjects for this student's class from Timetable using ClassOid
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
                    ClassName = className,
                    SubjectsCount = subjects.Count,
                    SubjectsNames = subjects.Select(s => s.Name).ToList()
                });
            }

            return result;
        }
    }
}