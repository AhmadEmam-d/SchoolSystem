using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace SchoolSystem.Application.Features.Classes.Commands.Delete
{
    public class DeleteClassCommandHandler
        : IRequestHandler<DeleteClassCommand>
    {
        private readonly IGenericRepository<Class> _repo;

        public DeleteClassCommandHandler(IGenericRepository<Class> repo)
        {
            _repo = repo;
        }

        public async Task<Unit> Handle(DeleteClassCommand request, CancellationToken cancellationToken)
        {
            var entity = await _repo.GetByOidAsync(request.Id);
            if (entity == null) throw new Exception("Class not found");

            await _repo.DeleteAsync(entity.Oid);
            return Unit.Value;
        }
    }

}
