// Application/Features/Parents/Queries/GetChildSchedule/GetChildScheduleQuery.cs
using MediatR;
using SchoolSystem.Application.Features.Parents.DTOs;

namespace SchoolSystem.Application.Features.Parents.Queries.GetChildSchedule
{
    public class GetChildScheduleQuery : IRequest<ChildScheduleDto>
    {
        public Guid ChildId { get; set; }
        public string ParentUserId { get; set; }

        public GetChildScheduleQuery(Guid childId, string parentUserId)
        {
            ChildId = childId;
            ParentUserId = parentUserId;
        }
    }
}