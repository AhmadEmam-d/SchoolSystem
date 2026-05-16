// Application/Features/Parents/Queries/GetChildrenDashboard/GetChildrenDashboardQuery.cs
using MediatR;
using SchoolSystem.Application.Features.Parents.DTOs;

namespace SchoolSystem.Application.Features.Parents.Queries.GetChildrenDashboard
{
    public record GetChildrenDashboardQuery(Guid ParentUserId)
        : IRequest<ChildrenFullDashboardDto>;
}