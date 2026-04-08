using MediatR;
using SchoolSystem.Application.Features.Lessons.DTOs.Create;

public class CreateLessonCommand : IRequest<Guid>
{
    public CreateLessonDto Lesson { get; set; }
    public Guid TeacherId { get; set; }

    public CreateLessonCommand(CreateLessonDto lesson, Guid teacherId)
    {
        Lesson = lesson;
        TeacherId = teacherId;
    }
}