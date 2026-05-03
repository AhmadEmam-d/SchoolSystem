using MediatR;
using SchoolSystem.Application.Features.Parents.DTOs.Read;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Parents.Queries.GetParentGrades
{
    public class GetParentGradesQuery : IRequest<List<StudentGradesFullDto>>
    {
        public Guid ParentUserId { get; set; }
    }
}
