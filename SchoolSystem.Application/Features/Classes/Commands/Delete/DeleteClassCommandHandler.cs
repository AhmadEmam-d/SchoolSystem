using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Classes.Commands.Delete
{
    public class DeleteClassCommandHandler
        : IRequestHandler<DeleteClassCommand>  // بدون Unit
    {
        private readonly IGenericRepository<Class> _repo;

        public DeleteClassCommandHandler(IGenericRepository<Class> repo)
        {
            _repo = repo;
        }

        public async Task Handle(DeleteClassCommand request, CancellationToken cancellationToken)
        {
            var entity = await _repo.GetByOidAsync(request.Id);
            if (entity == null)
                throw new Exception("Class not found");

            await _repo.DeleteAsync(entity.Oid);
            // لا ترجع Unit.Value - احذف هذه السطر
        }
    }
}