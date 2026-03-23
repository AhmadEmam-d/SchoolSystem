using AutoMapper;
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Classes.Commands.Update
{
    public class UpdateClassCommandHandler
        : IRequestHandler<UpdateClassCommand, UpdateClassCommandResponse>
    {
        private readonly IGenericRepository<Class> _repo;
        private readonly IMapper _mapper;

        public UpdateClassCommandHandler(IGenericRepository<Class> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<UpdateClassCommandResponse> Handle(UpdateClassCommand request, CancellationToken cancellationToken)
        {
            var entity = await _repo.GetByOidAsync(request.Oid);
            if (entity == null)
                throw new Exception($"Class with Oid {request.Oid} not found.");

            _mapper.Map(request.Class, entity);
            entity.UpdatedAt = DateTime.UtcNow;

            await _repo.UpdateAsync(entity);

            return new UpdateClassCommandResponse { Oid = entity.Oid };
        }
    }
}