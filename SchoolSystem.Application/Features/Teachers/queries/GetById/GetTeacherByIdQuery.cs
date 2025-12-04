using MediatR;
using SchoolSystem.Application.Features.Teachers.DTOs;

namespace SchoolSystem.Application.Features.Teachers.Query.GetById
{
    public class GetTeacherByIdQuery : IRequest<TeacherResponseDto>
    {
        public Guid Oid { get; set; }

        public GetTeacherByIdQuery(Guid oid)
        {
            Oid = oid;
        }
    }
}