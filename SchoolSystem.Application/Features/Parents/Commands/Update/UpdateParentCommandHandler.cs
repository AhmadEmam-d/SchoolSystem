using AutoMapper;
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Parents.Commands.Update
{
    public class UpdateParentCommandHandler
        : IRequestHandler<UpdateParentCommand, UpdateParentCommandResponse>
    {
        private readonly IGenericRepository<Parent> _repo;
        private readonly IMapper _mapper;

        public UpdateParentCommandHandler(IGenericRepository<Parent> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<UpdateParentCommandResponse> Handle(UpdateParentCommand request, CancellationToken cancellationToken)
        {
            var entity = await _repo.GetByOidAsync(request.Oid);
            if (entity == null)
                throw new Exception($"Parent with Oid {request.Oid} not found.");

            _mapper.Map(request.Parent, entity);
            entity.UpdatedAt = DateTime.UtcNow;

            await _repo.UpdateAsync(entity);

            return new UpdateParentCommandResponse { Oid = entity.Oid };
        }
    }
}