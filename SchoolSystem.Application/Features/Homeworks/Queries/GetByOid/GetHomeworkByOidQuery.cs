using MediatR;
using SchoolSystem.Application.Features.Homeworks.DTOs.Response;

namespace SchoolSystem.Application.Features.Homeworks.Queries.GetByOid
{
    public class GetHomeworkByOidQuery : IRequest<HomeworkDetailResponseDto>
    {
        public Guid Oid { get; set; }

        public GetHomeworkByOidQuery(Guid oid)
        {
            Oid = oid;
        }
    }
}