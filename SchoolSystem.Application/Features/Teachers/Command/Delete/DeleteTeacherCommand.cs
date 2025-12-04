using MediatR;

namespace SchoolSystem.Application.Features.Teachers.Command.Delete
{
    public record DeleteTeacherCommand(Guid Oid) : IRequest;
}
