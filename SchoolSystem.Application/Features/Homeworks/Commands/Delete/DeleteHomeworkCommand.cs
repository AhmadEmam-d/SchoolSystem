using MediatR;

namespace SchoolSystem.Application.Features.Homeworks.Commands.Delete
{
    public class DeleteHomeworkCommand : IRequest<bool>
    {
        public Guid Oid { get; set; }

        public DeleteHomeworkCommand(Guid oid)
        {
            Oid = oid;
        }
    }
}
