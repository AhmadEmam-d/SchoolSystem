// Application/Features/Subjects/Queries/GetMySubjects/GetMySubjectsQuery.cs
using MediatR;
using SchoolSystem.Application.Features.Subjects.DTOs;
using System;
using System.Collections.Generic;

namespace SchoolSystem.Application.Features.Subjects.Queries.GetMySubjects
{
    public class GetMySubjectsQuery : IRequest<List<MySubjectDto>>
    {
        public Guid EntityId { get; set; }  // StudentId, TeacherId, or ParentId
        public string Role { get; set; } = string.Empty;
        public Guid? SubjectId { get; set; }

        public GetMySubjectsQuery(Guid entityId, string role, Guid? subjectId = null)
        {
            EntityId = entityId;
            Role = role;
            SubjectId = subjectId;
        }
    }
}