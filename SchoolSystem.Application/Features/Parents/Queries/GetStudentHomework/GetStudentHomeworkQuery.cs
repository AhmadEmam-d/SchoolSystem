using MediatR;
using SchoolSystem.Application.Features.Parents.DTOs;

namespace SchoolSystem.Application.Features.Parents.Queries.GetStudentHomework
{
    public class GetStudentHomeworkQuery : IRequest<List<StudentHomeworkDto>>
    {
        // نستخدم معرف المستخدم (User ID) القادم من نظام الصلاحيات
        public Guid ParentUserId { get; set; }
    }
}