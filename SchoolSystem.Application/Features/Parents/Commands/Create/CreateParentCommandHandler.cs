using AutoMapper;
using MediatR;
using SchoolSystem.Domain.Entities;
using SchoolSystem.Domain.Interfaces.Common;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace SchoolSystem.Application.Features.Parents.Commands.Create
{
    public class CreateParentCommandHandler
        : IRequestHandler<CreateParentCommand, CreateParentCommandResponse>
    {
        private readonly IGenericRepository<Parent> _repo;
        private readonly IMapper _mapper;

        public CreateParentCommandHandler(IGenericRepository<Parent> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<CreateParentCommandResponse> Handle(CreateParentCommand request, CancellationToken cancellationToken)
        {
            var entity = _mapper.Map<Parent>(request.Parent);
            entity.Oid = Guid.NewGuid();
            entity.CreatedAt = DateTime.UtcNow;

            await _repo.CreateAsync(entity);

            return new CreateParentCommandResponse { Oid = entity.Oid };
        }
    }
}