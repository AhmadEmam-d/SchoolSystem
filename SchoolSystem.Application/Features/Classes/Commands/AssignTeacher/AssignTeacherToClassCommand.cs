using MediatR;

namespace SchoolSystem.Application.Features.Classes.Commands.AssignTeacher
{
    public class AssignTeacherToClassCommand : IRequest<bool>
    {
        public Guid ClassId { get; set; }
        public Guid TeacherId { get; set; }

        public AssignTeacherToClassCommand(Guid classId, Guid teacherId)
        {
            ClassId = classId;
            TeacherId = teacherId;
        }
    }
}