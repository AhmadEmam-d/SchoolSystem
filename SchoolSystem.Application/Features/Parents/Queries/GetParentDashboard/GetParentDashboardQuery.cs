using MediatR;
using SchoolSystem.Application.Features.Parents.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Parents.Queries.GetParentDashboard
{
    public class GetParentDashboardQuery : IRequest<ParentDashboardDto>
    {
        public Guid ParentUserId { get; set; }
    }
}
