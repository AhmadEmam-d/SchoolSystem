// Application/Features/Lessons/Commands/Update/UpdateLessonCommand.cs
using MediatR;
using SchoolSystem.Application.Features.Lessons.DTOs;

namespace SchoolSystem.Application.Features.Lessons.Commands.Update
{
    public class UpdateLessonCommand : IRequest<LessonResponseDto>
    {
        public Guid Oid { get; set; }
        public UpdateLessonDto Lesson { get; set; }

        public UpdateLessonCommand(Guid oid, UpdateLessonDto lesson)
        {
            Oid = oid;
            Lesson = lesson;
        }
    }
}