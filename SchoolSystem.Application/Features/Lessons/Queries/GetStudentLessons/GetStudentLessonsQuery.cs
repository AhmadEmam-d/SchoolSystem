// Application/Features/Lessons/Queries/GetStudentLessons/GetStudentLessonsQuery.cs
using MediatR;
using SchoolSystem.Application.Features.Lessons.DTOs;
using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Lessons.Queries.GetStudentLessons
{
    public class GetStudentLessonsQuery : IRequest<List<LessonResponseDto>>
    {
        public Guid ClassOid { get; set; }
        public Guid? SubjectOid { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}