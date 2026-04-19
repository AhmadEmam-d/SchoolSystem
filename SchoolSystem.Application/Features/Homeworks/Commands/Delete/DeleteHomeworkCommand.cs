// Application/Features/Homeworks/Commands/Delete/DeleteHomeworkCommand.cs
using MediatR;

namespace SchoolSystem.Application.Features.Homeworks.Commands.Delete
{
    public class DeleteHomeworkCommand : IRequest<bool>
    {
        public Guid Id { get; set; }

        public DeleteHomeworkCommand(Guid id)
        {
            Id = id;
        }
    }
}